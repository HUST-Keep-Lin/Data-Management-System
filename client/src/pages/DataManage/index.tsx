import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Tag,
  Button,
  Input,
  Select,
  Popconfirm,
  DatePicker,
  message,
  Form
} from "antd";

import type { TablePaginationConfig } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import locale_CN from "antd/es/date-picker/locale/zh_CN";
import locale_EN from "antd/es/date-picker/locale/en_US";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { LanguageType, ContentType, DataType, TagsType } from "../../type";
import MyDataModal from "../../components/MyDataModal";
import { addData, deleteData, editData, getData } from "../../utils/api/info";
import { getTags } from "../../utils/api/tag";

import "./index.css";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function DataManage() {
  //全局语言设置数据
  const language: LanguageType = useSelector(
    (state: RootState) => state.language
  );
  const { content }: { content: ContentType } = language;

  //实现数据加载loading
  const [loading, setLoading] = useState(true);

  //全局展示操作反馈信息
  const [messageApi, contextHolder] = message.useMessage();

  //需要渲染的数据
  const [data, setData] = useState<DataType[]>([]);
  //标签数据
  const [tagsData, setTagsData] = useState<TagsType[]>([] as TagsType[]);

  //上方搜索栏的状态
  const [nameSearchValue, setNameSearchValue] = useState("");
  const [tagsSearchValue, setTagsSearchValue] = useState<string[]>([]);
  const [timeSearchValue, setTimeSearchValue] = useState<string[]>([]);

  //实现重置时日期框数据为空
  const [time, setTime] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  //页面切换时设置当前page以及page的size
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [addModalVisible, setAddModalVisible] = useState(false); //新增对话框是否可见
  const [editModelVisible, setEditModalVisible] = useState(false); //编辑对话框是否课件
  const [editInitialvalue, setEditInitialVisibal] = useState<DataType>(
    {} as DataType
  ); //编辑的数据

  const formAdd = Form.useForm()[0]
  const formEdit = Form.useForm()[0]

  //页面初始化函数
  const init = async () => {
      try {
      const infoRes = await getData(
        nameSearchValue,
        tagsSearchValue,
        timeSearchValue
      );
      setData(infoRes.data);
      
      const tagRes = await getTags();
      
      setTagsData(tagRes.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  //页面挂载时数据的获取
  useEffect(() => {
    setLoading(true);
    init();
  }, []);


  //分页的配置项
  const pagination: TablePaginationConfig = {
    current: currentPage,
    position: ["bottomRight"],
    pageSize: pageSize,
    showSizeChanger: true,
    onChange: (page: number, size: number) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };
  //删除按钮的回调
  const handleDeleteClick = async (key: any) => {
    //保证最后一页的最后一个元素被删除时，编号不会混乱
    if (
      Math.floor(data.length / pageSize) === currentPage - 1 &&
      data.length % pageSize === 1
    ) {
      setCurrentPage(currentPage - 1);
    }
    await deleteData(key); //删除数据
    const res = await getData(
      nameSearchValue,
      tagsSearchValue,
      timeSearchValue
    );
    setData(res.data);
    messageApi.success(language.type === "zh-CN"?"删除成功":"Delete One Message")
  };

  //Add状态点击create新增之后的回调,发送post请求给服务器，新增数据 DONE
  const onCreate = async (values: {}) => {
    setAddModalVisible(false);
    await addData(values);
    const res = await getData(
      nameSearchValue,
      tagsSearchValue,
      timeSearchValue
    );
    setData(res.data);
    if (currentPage === 0) setCurrentPage(1);
    messageApi.success(language.type === "zh-CN"?"新增了一条数据":"Add One Message")
  };

  //编辑状态时点击Edit的回调: post修改的数据，并对数据重新拉取 done
  const onEdit = async (values: DataType) => {
    await editData(values);
    const res = await getData(
      nameSearchValue,
      tagsSearchValue,
      timeSearchValue
    );
    setData(res.data);
    setEditModalVisible(false);
  };

  //搜索按钮的的回调
  const handleSearchClick = async () => {
    //发送过滤请求
    const res = await getData(
      nameSearchValue,
      tagsSearchValue,
      timeSearchValue
    );
    //更新数据   此时要注意执行了搜索之后页面应该从第一页开始
    setData(res.data);
    setCurrentPage(1);
  };
  //重置按钮的回调
  const handleResetClick = async () => {
    //状态清空
    await setNameSearchValue(() => "");
    await setTagsSearchValue([]);
    await setTimeSearchValue([]);
    setTime(null);
    //重新拉取数据库数据，并设置页面为第一页
    const res = await getData("", [], []);
    setData(res.data);
    setCurrentPage(1);
  };

  //table的每列渲染数据
  const columns: ColumnsType<DataType> = [
    {
      title: content.id,
      key: "index",
      render: (_: any, __: DataType, index) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: content.name,
      key: "name",
      dataIndex: "name",
    },
    {
      title: content.desc,
      key: "describe",
      dataIndex: "describe",
    },
    {
      title: content.time,
      key: "addTime",
      dataIndex: "addTime",
      render: (value: any) => dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: content.tags,
      key: "tags",
      dataIndex: "tags",
      render: (value: TagsType[]) =>
        value.map((tag) => (
          <Tag color="blue" key={tag.key}>
            {tag.name}
          </Tag>
        )),
    },
    {
      title: content.action,
      key: "action",
      // width: "100px",
      render: (_: any, record: DataType) => (
        <Space size="middle">
          <Button
            style={{ border: "none", width: "60px", color: "rgb(102 174 242)" }}
            onClick={async() => {    
              await setEditInitialVisibal(record);
              await setEditModalVisible(true);
              formEdit.resetFields()
            }}
          >
            {content.btns[3]}
          </Button>
          <Popconfirm
            title={language.type === "zh-CN" ? "删除" : "Delete"}
            description={
              language.type === "zh-CN" ? "确定删除?" : "Sure to delete?"
            }
            onConfirm={() => handleDeleteClick(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default" style={{ border: "none", width: "60px" }}>
              {content.btns[4]}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  console.log('search');
  
  return (
    <div className="datamanage">
      {contextHolder}
      {/* 数据的搜索功能 */}
      <div className="search">
        <div className="search-item">
          <label htmlFor="username" style={{ width: "50px" }}>
            {content.name}:
          </label>
          <Input
            id="username"
            placeholder={
              language.type === "zh-CN" ? "请输入搜索名称" : "Please enter name"
            }
            value={nameSearchValue}
            style={{ width: "18%", fontSize: "12px" }}
            onChange={(e) => setNameSearchValue(e.target.value)}
            onPressEnter={handleSearchClick}
          ></Input>
          &nbsp;
          <label htmlFor="choiceTag" style={{ width: "50px" }}>
            {content.tags}:
          </label>
          <Select
            maxTagCount='responsive'
            id="choiceTag"
            mode="multiple"
            allowClear
            placeholder={
              language.type === "zh-CN" ? "请选择标签" : "Please choice Tags"
            }
            value={tagsSearchValue}
            style={{ width: "24%", fontSize: "5px", textAlign: "left" }}
            onChange={(value) => setTagsSearchValue(value)}
          >
            {tagsData.map((tagData) => (
              <Option key={tagData.key} value={tagData.name}>
                {tagData.name}
              </Option>
            ))}
          </Select>
          &nbsp;
          <label htmlFor="time" style={{ width: "80px" }}>
            {content.time}:&nbsp;
          </label>
          {/* 使用国际化配置设置语言 */}
          <RangePicker
            style={{ width: "30%", fontSize: "10px" }}
            value={time}
            locale={language.type === "English" ? locale_EN : locale_CN}
            onChange={(dates, dateString: [string, string]) => {
              setTimeSearchValue(dateString);
              setTime(dates);
            }}
            onKeyDown={(e) => {if(e.key === 'Enter') console.log(111);handleSearchClick() }}
          />
        </div>
        &nbsp;&nbsp;
        <div className="search-submit">
          <Button
            type="primary"
            onClick={handleSearchClick}
            style={{ width: "80px" }}
          >
            {content.btns[0]}
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button
            type="default"
            onClick={handleResetClick}
            style={{ width: "80px" }}
          >
            {content.btns[1]}
          </Button>
        </div>
      </div>
      {/* //实现数据的添加 */}
      <div className="add">
        <Button
          type="primary"
          onClick={() => {
            setAddModalVisible(true)
            formAdd.resetFields()
          }}
          style={{ width: "60px" }}
        >
          {content.btns[2]}
        </Button>
        {/* 数据新增的MyModal组件 */}
        <MyDataModal
          open={addModalVisible}
          onCreate={onCreate}
          // 点击取消按钮之后Modal对话框不可见
          onCancel={() => {
            setAddModalVisible(false);
          }}
          addModalOpen={addModalVisible}
          tagsData={tagsData}
          form={formAdd}
        />
        {/* 数据编辑的MyModal组件 */}
        <MyDataModal
          open={editModelVisible}
          initialValue={editInitialvalue}
          onCreate={onEdit}
          // 点击取消按钮之后Modal对话框不可见
          onCancel={() => {
            setEditModalVisible(false);
          }}
          addModalOpen={addModalVisible}
          tagsData={tagsData}
          form={formEdit}
        />
      </div>
      {/* //数据的展示  需要进行代码优化 更具db中的数据格式进行arr.map运算产生多个Column组件*/}
      <div className="table-show">
        <Table
          dataSource={data}
          bordered={true}
          pagination={pagination}
          columns={columns}
          scroll={{ x: 900, y: 300}}
          size="small"
          loading={loading}
        ></Table>
      </div>
    </div>
  );
}
