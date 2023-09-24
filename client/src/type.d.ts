//语言的数据接口类型
export interface ContentType {
  theme: string;
  set: string;
  nav: string[];
  id: string;
  name: string;
  desc: string;
  time: string;
  tags: string;
  action: string;
  btns: string[];
}
//语言的接口类型
export interface LanguageType {
  type: string;
  content: ContentType;
}

//表格每一项数据的类型
export interface DataType {
  key: React.Key;
  name: string;
  describe: string;
  addTime: number;
  tags: TagsType[];
}
//标签接口
interface TagsType {
  key: React.Key,
  name: string
}
//数据界面对话框接口
interface DataMyModalProps {
  open: boolean;
  initialValue?: DataType;
  onCreate: (values: DataType) => void;
  onCancel: () => void;
  addModalOpen: boolean;
  tagsData: TagsType[]
  form: FormInstance<any>
}
//标签界面对话框接口
interface TagMyModalProps {
  open: boolean,
  initialValue?: TagsType,
  onOk: (values: TagsType) => void,
  onCancel: () => void,
  addModalOpen: boolean,
  form: FormInstance<any>
}
