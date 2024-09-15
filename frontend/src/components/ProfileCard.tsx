import { Avatar } from "./BlogCard";

interface ProfileCardProps {
  name: string;
  email: string;
}

export const ProfileCard = ({ name, email }: ProfileCardProps) => {
  return (
    <div className="text-center">
      <Avatar name={name} size={"big"} />
      <h2 className="text-xl font-bold mt-4">{name}</h2>
      <p className="text-slate-600">{email}</p>
    </div>
  );
};
