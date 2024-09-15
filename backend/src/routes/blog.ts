import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import {
  createBlogInput,
  createCommentInput,
  updateBlogInput,
} from "@stonksblog/stonksblog-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
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

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Incorrect inputs",
    });
  }
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId,
      published: true,
    },
  });

  return c.json({ id: blog.id });
});

blogRouter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Incorrect inputs",
    });
  }
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const blog = await prisma.post.findFirst({
    where: { id },
  });

  if (!blog) {
    c.status(404);
    return c.json({
      message: "Blog not found",
    });
  }

  if (blog.authorId !== userId) {
    c.status(403);
    return c.json({
      message: "You are not authorized to edit this blog",
    });
  }

  const updatedBlog = await prisma.post.update({
    where: {
      id,
    },

    data: {
      title: body.title,
      content: body.content,
      updatedAt: new Date(),
    },
  });

  return c.json({ id: updatedBlog.id });
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const page = parseInt(c.req.query("page") || "1", 10);
  const perPage = parseInt(c.req.query("perPage") || "5", 10);

  // Ensure page number is at least 1
  const skip = (page - 1) * perPage;

  const blogs = await prisma.post.findMany({
    skip: skip, // Skip previous pages' blogs
    take: perPage, // Take only `perPage` blogs
    select: {
      content: true,
      title: true,
      id: true,
      createdAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  // Count total blogs for client-side page calculation
  const totalBlogs = await prisma.post.count();

  return c.json({ blogs, totalBlogs });
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            bio: true,
          },
        },
      },
    });

    return c.json({ blog });
  } catch (e) {
    c.status(411);
    return c.json({ error: "Error while fetching the blog post" });
  }
});

blogRouter.get("/:id/comments", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json({ comments });
  } catch (e) {
    c.status(411);
    return c.json({ error: "Error while fetching comments" });
  }
});

blogRouter.post("/:id/comments", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const { success } = createCommentInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Incorrect inputs",
    });
  }
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Fetch the author's name from the database
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { name: true },
    });

    // Create the comment in the database
    const newComment = await prisma.comment.create({
      data: {
        content: body.content,
        author: {
          connect: { id: authorId },
        },
        post: {
          connect: { id },
        },
      },
    });

    c.status(201);
    return c.json({
      comment: { ...newComment, author: { name: author?.name || "Anonymous" } },
    });
  } catch (e) {
    console.error("Error posting comment:", e);
    c.status(500);
    return c.json({ error: "Failed to post comment" });
  }
});
