/**
   弹出视图组件
   */
import { memo } from "react";
import { Modal, Form, Input } from "antd";
import { useSelector } from "react-redux";
import { TagMyModalProps, LanguageType } from "../../type";
import { RootState } from "../../store";

//弹出的对话框组件
const MyTagModal: React.FC<TagMyModalProps> = (props) => {
  const { open, initialValue, onOk, onCancel, addModalOpen, form } = props;

  //获取store中的数据
  const language: LanguageType = useSelector(
    (state: RootState) => state.language
  );

  //自定义的输入规则，不能是全空的空格
  const myRules = (_: any, value: string) => {
    if (value.trim() === "")
      return Promise.reject(
        new Error(language.type === "zh-CN" ? "字段不能为空!" : "Empty!")
      );
    return Promise.resolve();
  };
  return (
    //Modal对话框，展示需要我们填写的数据
    <Modal
      open={open}
      forceRender={true}
      title={
        addModalOpen
          ? language.type === "zh-CN"
            ? "新增标签"
            : "Add a tag"
          : language.type === "zh-CN"
          ? "编辑标签"
          : "Edit a tag"
      }
      okText={language.type === "zh-CN" ? "确认" : "Ok"}
      cancelText={language.type === "zh-CN" ? "取消" : "Cancel"}
      onCancel={onCancel}
      // 点击确认之后的回调
      onOk={() => {
        form
          .validateFields()
          //获取我们需要的数据
          .then((values: any) => {
            form.resetFields();
            if (initialValue) values["key"] = initialValue.key;
            //   values["addTime"] = Date.now();
            // }
            onOk(values);
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
              message: language.type === "zh-CN"?"请输入标签名": "Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(MyTagModal);
