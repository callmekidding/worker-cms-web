import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './WorkerList.less';

const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const workerStatus = ['在职', '离职'];
const workerType = ['管理层', '大工', '小工'];

const CreateForm = Form.create()(props => {

  const formLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 13},
  };
  const {modalVisible, form, handleAdd, handleModalVisible} = props;
  const handleOnOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      // handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加工人信息"
      visible={modalVisible}
      onOk={handleOnOk}
      onCancel={() => handleModalVisible()}
    >
      <Form {...formLayout}>
        <FormItem key="workerName" label="工人名称">
          {form.getFieldDecorator('workerName', {
            rules: [{required: true, message: '请输入工人名称！', min: 2}],
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <Form.Item key="workerType" {...formLayout} label="工人工种">
          {
            form.getFieldDecorator('workerType', {
              rules: [{
                required: true,
                message: '请选择工人工种',
              }],
            })(
              <Select placeholder="请选择">
                <Option
                  value="0"
                >
                  管理层
                </Option>
                <Option
                  value="1"
                >
                  大工
                </Option>
                <Option
                  value="2"
                >
                  小工
                </Option>
              </Select>,
            )
          }
        </Form.Item>
      </Form>
    </Modal>
  );
});
const UpdateForm = Form.create()(props => {
  const formLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 13},
  };
  const {modalVisible, handleUpdateModalVisible, handleUpdate,values, form} = props;
  const handleOnUpdateOk = formVals => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(formVals);
    });
  };
  return (
    <Modal
      width={640}
      bodyStyle={{padding: '32px 40px 48px'}}
      destroyOnClose
      title="编辑工人信息"
      visible={modalVisible}
      onCancel={() => handleUpdateModalVisible(false, values)}
      onOk={handleOnUpdateOk(values)}
    >
      <Form {...formLayout} >

        <Form.Item key="workerName" {...formLayout} label="工人名称">
          {form.getFieldDecorator('workerName', {
            rules: [{required: true, message: '请输入工人名称！'}],
            initialValue: values.workerName,
          })(<Input placeholder="请输入"/>)}
        </Form.Item>
        <Form.Item key="workerType" {...formLayout} label="工人工种">
          {
            form.getFieldDecorator('workerType', {
              initialValue: `${values.workerType}`,
              rules: [{
                required: true,
                message: '请选择工人工种',
              }],
            })(
              <Select placeholder="请选择">
                <Option
                  value="0"
                >
                  管理层
                </Option>
                <Option
                  value="1"
                >
                  大工
                </Option>
                <Option
                  value="2"
                >
                  小工
                </Option>
              </Select>,
            )
          }
        </Form.Item>
      </Form>
    </Modal>
  );
});

// @Form.create()
// class UpdateForm extends PureComponent {
//   static defaultProps = {
//     handleUpdate: () => {
//     },
//     handleUpdateModalVisible: () => {
//     },
//     values: {},
//   };
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       formVals: {},
//     };
//     this.formLayout = {
//       labelCol: {span: 7},
//       wrapperCol: {span: 13},
//     };
//   };
//
//   handleOnUpdateOk = formVals => {
//     const {form, handleUpdate} = this.props;
//     // form.validateFields((err, fieldsValue) => {
//     //   if (err) return;
//     //   form.resetFields();
//     //   // handleUpdate(formVals);
//     // });
//   };
//
//   render() {
//     const {modalVisible, handleUpdateModalVisible, values, form} = this.props;
//     console.log(values);
//     return (
//       <Modal
//         width={640}
//         bodyStyle={{padding: '32px 40px 48px'}}
//         destroyOnClose
//         title="编辑工人信息"
//         visible={modalVisible}
//         onCancel={() => handleUpdateModalVisible(false, values)}
//         onOk={this.handleOnUpdateOk(values)}
//       >
//         <Form {...this.formLayout} onSubmit={this.handleSubmit}>
//
//           <Form.Item key="workerName" {...this.formLayout} label="工人名称">
//             {form.getFieldDecorator('workerName', {
//               rules: [{required: true, message: '请输入工人名称！'}],
//               initialValue: values.workerName,
//             })(<Input placeholder="请输入"/>)}
//           </Form.Item>
//           <Form.Item key="workerType" {...this.formLayout} label="工人工种">
//             {
//               form.getFieldDecorator('workerType', {
//                 initialValue: `${values.workerType}`,
//                 rules: [{
//                   required: true,
//                   message: '请选择工人工种',
//                 }],
//               })(
//                 <Select placeholder="请选择">
//                   <Option
//                     value="0"
//                   >
//                     管理层
//                   </Option>
//                   <Option
//                     value="1"
//                   >
//                     大工
//                   </Option>
//                   <Option
//                     value="2"
//                   >
//                     小工
//                   </Option>
//                 </Select>,
//               )
//             }
//           </Form.Item>
//         </Form>
//       </Modal>
//     );
//   }
// }

/* eslint react/no-multi-comp:0 */
@connect(({worker, loading}) => ({
  worker,
  loading: loading.models.worker,
}))
@Form.create()
class WorkerList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '工人编号',
      dataIndex: 'workerId',
      key: 'workerId',
    },
    {
      title: '工人名称',
      dataIndex: 'workerName',
      key: 'workerName',
    },
    {
      title: '工人工种',
      dataIndex: 'workerType',
      key: 'workerType',
      filters: [
        {
          text: workerType[0],
          value: 0,
        },
        {
          text: workerType[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={workerType[val]}/>;
      },
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={() => this.delete(record.workerId)}>删除</a>
          <Divider type="vertical"/>
          <a onClick={() => this.attendanceProfile(record.workerId)}>出勤明细</a>
          <Divider type="vertical"/>
          <a onClick={() => this.budgetProfile(record.workerId)}>收支明细</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'worker/queryWorker',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'worker/queryWorker',
      payload: params,
    });
  };

  previewItem = id => {
    router.push(`/profile/basic/${id}`);
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'worker/queryWorker',
      payload: {},
    });
  };


  handleMenuClick = e => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'worker/queryWorker',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  delete = (id) => {
    console.log(id);
  };

  attendanceProfile = (id) => {
    router.push(`/profile/attendance/${id}`);
  };

  budgetProfile = (id) => {
    router.push(`/profile/budget/${id}`);
  };

  handleAdd = fields => {
    const {dispatch} = this.props;
    dispatch({
      type: 'worker/addWorker',
      payload: {
        ...fields
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fieldsValue => {
    const {dispatch} = this.props;
    console.log('fieldsValue');
    console.log(fieldsValue);
    dispatch({
      type: 'worker/updateWorker',
      payload: {...fieldsValue}
    });
    message.success('编辑成功');
    this.handleUpdateModalVisible();
  };


  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem key="workerName" label="工人名称">
              {getFieldDecorator('workerName')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem key="workerType" label="工人工种">
              {getFieldDecorator('workerType')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="">全部</Option>
                  <Option value="0">管理层</Option>
                  <Option value="1">大工</Option>
                  <Option value="2">小工</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {worker, loading} = this.props;
    const {data} = worker;
    const {selectedRows, modalVisible, updateModalVisible, stepFormValues} = this.state;
    console.log('isUpdate');
    console.log(stepFormValues && Object.keys(stepFormValues).length);
    console.log('updateModalVisible');
    console.log(updateModalVisible);
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="工人信息列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={{list: data}}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} values={stepFormValues}/>
        ) : null}

      </PageHeaderWrapper>
    );
  }

}

export default WorkerList;
