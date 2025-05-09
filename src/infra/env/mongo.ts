interface IMongoEnv {
  uri: string
}

export const mongoEnv: IMongoEnv = {
  uri: String(process.env.MONGODB_URI),
};
