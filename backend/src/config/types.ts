import { Request } from "express";
import { ObjectId } from "mongoose";

export interface MulterRequest extends Request {
    file: 
   {
      buffer?: Buffer, 
      encoding: string, 
      fieldname: string, 
      mimetype?: string, 
      originalname: string, 
      size: number;
      key: string,
      location?: string
      bucket?: string,
      acl?: string,
      contentType?: string,
      contentDisposition?: null,
      contentEncoding?: null,
      storageClass?: string,
      serverSideEncryption?: null,
      metadata?: null,
      etag?: string,
      versionId?: undefined
  };
  }

  export interface Posts {
    _id: ObjectId ,
    title: string,
    desc: string,
    postPic: string,
    picKey: string,
    username: string,
    user: string,
    categories: Array<string>,
    createdAt: number,
    updatedAt: number,
    __v: 0
  }