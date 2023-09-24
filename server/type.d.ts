//标签接口
export interface TagsType {
  key: string,
  name: string
}
//数据接口
export interface DataType {
  key: string;
  name: string;
  describe: string;
  addTime: number,
  tags: TagsType[];
}
//语言接口
export interface LanguageType {
  type: string;
  content: object
}