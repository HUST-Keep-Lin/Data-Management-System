import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { ContentType, LanguageType, TagsType } from "../../type";
import { RootState } from "../../store";
import { ColumnsType } from "antd/es/table";
import { Button, Table, Space, Popconfirm, message, Form } from "antd";
import { addTag, deleteTag, editTag, getTags } from "../../utils/api/tag";
import MyTagModal from "../../components/MyTagModal";

export default function TagManage() {
  //获取store中的数据
  const language: LanguageType = useSelector(
    (state: RootState) => state.language
  );
  const { content }: { content: ContentType } = language;

  //组件的标签状态
  const [tags, setTags] = useState<TagsType[]>([] as TagsType[]);

  //实现数据加载loading
  const [loading, setLoading] = useState(true);

  //组件状态
  const [editModalOpen, setEditModalOpen] = useState(false); //编辑对话框的视图开关
  const [addModalOpen, setAddModalOpen] = useState(false); //增加对话框的视图开关
  const [editInitialvalue, setEditInitialvalue] = useState({} as TagsType); //编辑框的初始值

  //Form数据的数据管理
  const formAdd = Form.useForm()[0]
  const formEdit = Form.useForm()[0]

  //初始化获取tags的值
  useEffect(() => {
    init();
  }, []);
  //界面初始化函数
  const init = async () => {
    const res = await getTags();
    await setTags(res.data);
    setLoading(false)
  };
  //编辑弹出框确认的回调  PUT请求
  const onOk = async (value: TagsType) => {
    const res = await editTag(value);
    setTags(res.data);
    setEditModalOpen(false);
  };
  //新增弹出框确认的回调 POST请求 done
  const onCreate = async (value: any) => {
    try {
      const res = await addTag(value);
      message.success(language.type === 'zh-CN'? `新增了 ${value.name} 标签`: `add ${value.name} tag`);
      setTags(res.data);
      setAddModalOpen(false);
    } catch (error) {
      console.log(error);
      message.error(language.type === 'zh-CN'? `新增失败 已存在 ${value.name} 标签`: ` ${value.name} tag is exist`);
    }
  };
  //删除按钮的回调 DELETE请求 需要trycatch捕获 done
  const handleDeleteClick = async (key: any) => {
    //对于不能删除的标签进行捕获，并全局提示不可删除
    try {
      setLoading(true);
      const res = await deleteTag(key);
      
      setTags(res.data);
      message.success(language.type === 'zh-CN'? `删除成功`: `delete success`);
    } catch (error: any) {
      console.log(error);
      message.error(language.type === 'zh-CN'? `删除失败，该标签已被使用`: `delete error，this tag is used`);
    } finally {
      setLoading(false)
    }

  };
  //table的每列渲染数据
  const columns: ColumnsType<TagsType> = [
    {
      title: content.tags,
      key: "name",
      width: "20%",
      dataIndex: "name",
    },
    {
      title: content.action,
      key: "action",
      width: "10%",
      render: (_: any, record: any) => (
        <Space size="middle">
          {/* 标签的编辑 */}
          <Button
            style={{
              border: "none",
              color: "rgb(102 174 242)",
              backgroundColor: "inherit",
            }}
            onClick={async () => {
              await setEditInitialvalue(record);
              await setEditModalOpen(true);
              formEdit.resetFields()
              console.log(record);
            }}
          >
            {content.btns[3]}
          </Button>
          <Popconfirm
            title={language.type === 'zh-CN'?'删除': 'Delete' }
            description={language.type === "zh-CN" ? "确定删除?" : "Sure to delete?"}
            onConfirm={() => handleDeleteClick(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default" style={{ border: "none", color: "red" }}>
              {content.btns[4]}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="tag-manage" style={{ padding: "10px 10px" }}>
      <div
        className="add"
        style={{
          padding: "10px 10px",
          width: "800px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button type="primary" onClick={() => {
          setAddModalOpen(true)
          formAdd.resetFields()
        }}>
          {content.btns[2]}
        </Button>
        {/* 数据新增的MyModal组件 */}
        <MyTagModal
          open={addModalOpen}
          onOk={onCreate}
          onCancel={() => setAddModalOpen(false)}
          addModalOpen={addModalOpen}
          form={formAdd}
        />
      </div>
      <div className="tag-show" style={{ width: "800px" }}>
        {/* 数据编辑的弹出框 */}
        <MyTagModal
          open={editModalOpen}
          initialValue={editInitialvalue}
          onOk={onOk}
          onCancel={() => setEditModalOpen(false)}
          addModalOpen={addModalOpen}
          form={formEdit}
        />

        <Table
          dataSource={tags}
          bordered={true}
          columns={columns}
          size="small"
          pagination={false}
          loading={loading}
          scroll={{y: 400}}
        ></Table>
      </div>
    </div>
  );
}
