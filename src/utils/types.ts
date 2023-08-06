export type Post = {
  id: string;
  postPic?: string | null;
  postPicKey?: string | null;
  title: string;
  content: string;
  allowComments: boolean;
  createdAt: Date; // Atualize para o tipo Date
  authorId: string;
  author: {
    id: string;
    avatarUrl: string | null;
    avatarKey: string | null;
    email: string | null;
    name: string | null;
    updatedAt: Date | null; // Atualize para o tipo Date
    createdAt: Date; // Atualize para o tipo Date
  };
  categories: Array<{
    category: {
      id: string;
      name: string;
    };
    postId: string;
    categoryId: string;
    assignedAt: Date; // Atualize para o tipo Date
  }>;
};

  export type Posts = Array<Post>
  
  export type Category ={
    id: string;
    name: string;
  }
  
  export type Categories = Array<Category>

  export type User = {
    id: string;
    avatarUrl: string;
    avatarKey: string;
    email: string;
    name: string;
    updatedAt: Date;
    createdAt: Date;
  }

  export type StateType = {
    open: boolean;
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  