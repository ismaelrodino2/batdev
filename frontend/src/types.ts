export type Category = {
    _id: string
    name: string
    user: string
    createdAt: string
    updatedAt: string
    __v: number
}
export type Post = {
    _id: string
    title: string
    desc: string
    postPic?: string
    picKey?: string
    username: string
    categories?: Array<Category>
    user: string
    createdAt: string
    updatedAt: string
    __v?: number
}

export type Posts = Array<Post>

export type User = {
    name: string
    username: string
    profilePic?: string
    email: string
    password: string
    id: string
    createdAt: number
    updatedAt: number
    __v?: number
}

export type IsAuthenticated = () => boolean

export type Categories = Array<Category>
