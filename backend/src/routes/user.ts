import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import {
  signupInput,
  signinInput,
  updateUserInput,
} from "@stonksblog/stonksblog-common";
import { passwordChecker, passwordHasher } from "../utils";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.use("/profile/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const token = authHeader.split(" ")[1];
  try {
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id as string);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "Unauthorized",
      });
    }
  } catch (e) {
    console.log(e);
    c.status(403);
    return c.json({
      message: "Unauthorized",
    });
  }
});

userRouter.get("/profile/view", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const profile = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
      },
    });
    return c.json({ profile });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({
      message: "Something went wrong",
    });
  }
});

userRouter.put("/profile/view", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();

  if (
    (body.currentPassword && body.newPassword && !body.bio) ||
    (body.currentPassword && body.newPassword && body.bio)
  ) {
    const { success } = updateUserInput.safeParse(body);

    if (!success) {
      c.status(411);
      return c.json({
        message: "Incorrect inputs",
      });
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          password: true,
        },
      });
      console.log(user?.password);
      if (!user) {
        c.status(403);
        return c.json({
          message: "Unauthorized",
        });
      }

      const passwordsMatch = await passwordChecker(
        body.currentPassword,
        user.password
      );
      console.log(passwordsMatch);

      if (passwordsMatch === false) {
        c.status(403);
        return c.json({
          message: "Current password is incorrect",
        });
      }

      // Check if we need to update the password
      if (body.newPassword && !body.bio) {
        const { saltHex: newSaltHex, hashedPassword: newHashedPassword } =
          await passwordHasher(body.newPassword);

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: `${newSaltHex}:${newHashedPassword}`,
          },
        });
      } else if (body.bio && body.newPassword) {
        // Update both bio and password
        const { saltHex: newSaltHex, hashedPassword: newHashedPassword } =
          await passwordHasher(body.newPassword);

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: `${newSaltHex}:${newHashedPassword}`,
            bio: body.bio,
          },
        });
      }
      return c.json({ message: "Profile updated" });
    } catch (e) {
      console.log(e);
      c.status(500);
      return c.json({
        message: "Something went wrong",
      });
    }
  } else {
    //only bio provided
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          password: true,
        },
      });
      console.log(user?.password);
      if (!user) {
        c.status(403);
        return c.json({
          message: "Unauthorized",
        });
      }

      // Update only bio
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          bio: body.bio,
        },
      });

      return c.json({ message: "Bio updated" });
    } catch (e) {
      console.log(e);
      c.status(500);
      return c.json({
        message: "Something went wrong",
      });
    }
  }
});

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Incorrect inputs",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { saltHex, hashedPassword } = await passwordHasher(body.password);

    // Store both the salt and the hashed password in the database
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.username,
        password: `${saltHex}:${hashedPassword}`, // Store as "salt:hashedPassword"
      },
    });
    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.text(jwt);
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text("Invalid Inputs");
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Incorrect inputs",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.username,
      },
    });
    if (!user) {
      c.status(403);
      return c.json({
        message: "Invalid Credentials",
      });
    }

    const passwordsMatch = await passwordChecker(body.password, user.password);

    // Compare the hashed password with the stored hashed password
    if (passwordsMatch === false) {
      c.status(403);
      return c.json({
        message: "Invalid Credentials",
      });
    }

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.text(jwt);
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.text("Invalid Credentials");
  }
});
