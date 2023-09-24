import React, {memo, useEffect} from "react";
import { useSelector } from "react-redux";
import { Modal, Form, Input, Select } from "antd";
import { DataMyModalProps, LanguageType, TagsType } from "../../type";
import { RootState } from "../../store";

const { Option } = Select;

const MyDataModal: React.FC<DataMyModalProps> = (props) => {
  const { open, initialValue, onCreate, onCancel, addModalOpen, tagsData, form} =
    props;

  //获取store中的数据
  const language: LanguageType = useSelector(
    (state: RootState) => state.language
  );

  //将initialValue.tags 的形式从 TagsType[] => string[]
  const tagsValue: string[] = [];
  if (initialValue?.tags) {
    for (let i = 0; i < initialValue.tags.length; i++) {
      tagsValue.push(initialValue.tags[i].name);
    }
  }
  //自定义的输入规则，不能是全空的空格
  const myRules = (_:any, value: string) => {
    if(value.trim() === '') return Promise.reject(new Error(language.type === 'zh-CN'?'字段不能为空!': 'Empty!'));
    return Promise.resolve()
  }
  
  return (
    //Modal对话框，展示需要我们填写的数据
    <Modal
      open={open}
      forceRender={true}
      title={
        addModalOpen
          ? language.type === "zh-CN"
            ? "新增数据"
            : "Add a message"
          : language.type === "zh-CN"
          ? "编辑数据"
          : "Edit a message"
      }
      okText={language.type === "zh-CN" ? "确认" : "Ok"}
      cancelText={language.type === "zh-CN" ? "取消" : "Cancel"}
      onCancel={() => {
        form.resetFields();
        onCancel()
      }}
      // 点击确认之后的回调
      onOk={() => {
        form
          .validateFields()
          //获取我们需要的数据
          .then((values: any) => {
            form.resetFields();
            if (initialValue) {
              values["key"] = initialValue.key;
              values["addTime"] = Date.now();
            }
            if(!values.describe) values.describe = ""
            //需要对values.tags进行处理 string[] => TagsType[]
            const tags: TagsType[] = [] as TagsType[];
            while (values.tags.length > 0) {
              const tag = values.tags.shift();
              const index = tagsData.findIndex(
                (tagData) => tagData.name === tag
              );
              tags.push(tagsData[index]);
            }
            values.tags = tags;
            onCreate(values);
          })
          .catch((info: any) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      {/* 数据信息的Form表单 */}
      <Form form={form} layout="vertical" name="form_in_modal">
        {/* 名称项 */}
        <Form.Item
          name="name"
          label={language.type === "zh-CN" ? "名称" : "Name"}
          initialValue={initialValue?.name}
          rules={[
            {
              required: true,
              validator: myRules,
              message: language.type === 'zh-CN'?'请输入名称':"Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* 描述项 */}
        <Form.Item
          name="describe"
          label={language.type === "zh-CN" ? "描述" : "Describe"}
          initialValue={initialValue?.describe}
        >
          <Input type="textarea" />
        </Form.Item>
        {/* tag项 */}
        <Form.Item
          name="tags"
          label={language.type === "zh-CN" ? "标签" : "Tag"}
          initialValue={tagsValue}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
          >
            {tagsData.map((tagData) => (
              <Option key={tagData.key} value={tagData.name}>
                {tagData.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(MyDataModal)
