import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import {Badge, Button, Card, DatePicker, Divider, Form, Input, InputNumber, message, Modal, Select, Table} from 'antd';
import moment from 'moment';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BudgetProfile.less';

const {Option} = Select;
const {MonthPicker, RangePicker} = DatePicker;
const {Description} = DescriptionList;
const budgetType = ['收入', '支出'];
const workerTypeMap = ['大工', '小工'];
const statusMap = ['success', 'error'];
const monthFormat = 'YYYY-MM';
const now = new Date();
const thisYear = now.getFullYear();
const thisMonth = now.getMonth() + 1;
const FormItem = Form.Item;


function disabledDate(current) {
  return current && current > moment().endOf('day');
}

function parseInteger(value) {
  if (!value || value === '' || typeof value == 'undefined') {
    return 0;
  }
  return parseInt(value);
}

class AmountView extends PureComponent {
  render() {
    const {value, form, onChange} = this.props;
    let values = ['', '', '', '', ''];
    if (value) {
      values = value.split('-');
    }
    return (
      <Fragment>
        <FormItem key="budgetAmount-wan" style={{display: 'inline-block'}}>
          {form.getFieldDecorator('budgetAmount-wan', {initialValue: values[0]})(
            <InputNumber size="small" style={{width: 50}} min={0} max={100}
                         onChange={e => {
                           onChange(`${e}-${values[1]}-${values[2]}-${values[3]}-${values[4]}`);
                         }}/>
          )}
        </FormItem>
        <span style={{margin: 2}}>万</span>
        <FormItem key="budgetAmount-qian" style={{display: 'inline-block'}}>
          {form.getFieldDecorator('budgetAmount-qian', {initialValue: values[1]})(
            <InputNumber size="small" style={{width: 50}} min={0} max={9}
                         onChange={e => {
                           onChange(`${values[0]}-${e}-${values[2]}-${values[3]}-${values[4]}`);
                         }}/>
          )}
        </FormItem>
        <span style={{margin: 2}}>千</span>
        <FormItem key="budgetAmount-bai" style={{display: 'inline-block'}}>
          {form.getFieldDecorator('budgetAmount-bai', {initialValue: values[2]})(
            <InputNumber size="small" style={{width: 50}} min={0} max={9}
                         onChange={e => {
                           onChange(`${values[0]}-${values[1]}-${e}-${values[3]}-${values[4]}`);
                         }}/>
          )}
        </FormItem>
        <span style={{margin: 2}}>百</span>
        <FormItem key="budgetAmount-shi" style={{display: 'inline-block'}}>
          {form.getFieldDecorator('budgetAmount-shi', {initialValue: values[3]})(
            <InputNumber size="small" style={{width: 50}} min={0} max={9}
                         onChange={e => {
                           onChange(`${values[0]}-${values[1]}-${values[2]}-${e}-${values[4]}`);
                         }}/>
          )}
        </FormItem>
        <span style={{margin: 2}}>十</span>
        <FormItem key="budgetAmount-yuan" style={{display: 'inline-block'}}>
          {form.getFieldDecorator('budgetAmount-yuan', {initialValue: values[4]})(
            <InputNumber size="small" style={{width: 50}} min={0} max={9}
                         onChange={e => {
                           onChange(`${values[0]}-${values[1]}-${values[2]}-${values[3]}-${e}`);
                         }}/>
          )}
        </FormItem>
        <span style={{margin: 2}}>元</span>
      </Fragment>
    );
  }
}

@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.formLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };
  }

  handleOnOk = () => {
    const {form, handleAdd} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  validatorPhone = (rule, value, callback) => {
    if (!value) {
      callback('收支金额不能为空');
    } else {
      const values = value.split('-');
      const amount_wan = parseInteger(values[0]);
      const amount_qian = parseInteger(values[1]);
      const amount_bai = parseInteger(values[2]);
      const amount_shi = parseInteger(values[3]);
      const amount_yuan = parseInteger(values[4]);
      const amount = amount_wan * 10000 + amount_qian * 1000 + amount_bai * 100 + amount_shi * 10 + amount_yuan;
      if (amount === 0 || !amount) {
        callback('收支金额不能为空');
      }
    }
    callback();
  };

  render() {

    const {modalVisible, form, handleAddModalVisible, workerData} = this.props;
    return (
      <Modal
        width={600}
        destroyOnClose
        title="新增收支信息"
        visible={modalVisible}
        onOk={this.handleOnOk}
        onCancel={() => handleAddModalVisible()}
      >
        <Form {...this.formLayout}>
          <FormItem key="workerName" labelCol={{span: 5}} wrapperCol={{span: 15}} label="工人姓名">
            {form.getFieldDecorator('workerName', {
              initialValue: workerData.workerName,
            })(<Input disabled={true}/>)}
          </FormItem>
          <FormItem key="budgetType" labelCol={{span: 5}} wrapperCol={{span: 15}} label="收支类型">
            {
              form.getFieldDecorator('budgetType', {
                rules: [{
                  required: true,
                  message: '请选择收支类型',
                }],
              })(
                <Select placeholder="请选择">
                  <Option value="0">收入</Option>
                  <Option value="1">支出</Option>
                </Select>,
              )
            }
          </FormItem>
          <FormItem key="budgetAmount" labelCol={{span: 5}} wrapperCol={{span: 15}} label="收支金额">
            {form.getFieldDecorator('budgetAmount', {
              rules: [
                {
                  required: true,
                  message: "test",
                },
                {validator: this.validatorPhone},
              ],
            })(<AmountView form={form}/>)}
          </FormItem>
          <FormItem key="budgetDate" labelCol={{span: 5}} wrapperCol={{span: 15}} label="收支时间">
            {form.getFieldDecorator('budgetDate', {
              rules: [{required: true, message: '请选择收支时间！'}],
            })(
              <DatePicker
                style={{width: '100%'}}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择收支时间"
              />
            )}
          </FormItem>
          <FormItem key="reason" labelCol={{span: 5}} wrapperCol={{span: 15}} label="收支备注">
            {form.getFieldDecorator('reason', {})(<Input placeholder="请输入收支备注"/>)}
          </FormItem>
          <FormItem key="approver" labelCol={{span: 5}} wrapperCol={{span: 15}} label="审批人">
            {form.getFieldDecorator('approver', {})(<Input placeholder="请输入审批人"/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      budgetId: null,
      budgetType: null,
      // budgetAmount: this.formatBudgetAmount(this.props.values.budgetAmount),
      // workerName: props.values.workerName,
      // ...this.props
    };
    this.formLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };
  }

  componentDidMount() {
    console.log('this.props');
    console.log(this.props);
    this.setState({
      budgetId: this.props.values.budgetId,
      budgetType: this.props.values.budgetType,
    });
  }

  formatBudgetAmount = amount => {
    if (!amount || amount === '' || typeof amount == 'undefined') {
      return '0-0-0-0-0'
    }
    const w = parseInt(amount % 100000 / 10000);
    const q = parseInt(amount % 100000 % 10000 / 1000);
    const b = parseInt(amount % 100000 % 10000 % 1000 / 100);
    const s = parseInt(amount % 100000 % 10000 % 1000 % 100 / 10);
    const g = parseInt(amount % 100000 % 10000 % 1000 % 100 % 10);
    const value = w + '-' + q + '-' + b + '-' + s + '-' + g;
    console.log('value');
    console.log(value);
    return value;
  };

  handleOnOk = () => {
    const {form, handleUpdate} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };

  validatorPhone = (rule, value, callback) => {
    if (!value) {
      callback('收支金额不能为空');
    } else {
      const values = value.split('-');
      const amount_wan = parseInteger(values[0]);
      const amount_qian = parseInteger(values[1]);
      const amount_bai = parseInteger(values[2]);
      const amount_shi = parseInteger(values[3]);
      const amount_yuan = parseInteger(values[4]);
      const amount = amount_wan * 10000 + amount_qian * 1000 + amount_bai * 100 + amount_shi * 10 + amount_yuan;
      if (amount === 0 || !amount) {
        callback('收支金额不能为空');
      }
    }
    callback();
  };

  render() {
    const {modalVisible, form, handleUpdateModalVisible, workerData} = this.props;
    console.log('this.props');
    console.log(this.props);
    console.log('this.state');
    console.log(this.state);
    return (
      <Modal
        width={600}
        destroyOnClose
        title="编辑收支信息"
        visible={modalVisible}
        onOk={this.handleOnOk}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Form {...this.formLayout}>
          <FormItem key="workerName" labelCol={{span: 5}} wrapperCol={{span: 15}} label="工人姓名">
            {form.getFieldDecorator('workerName', {
              initialValue: workerData.workerName,
            })(<Input disabled={true}/>)}
          </FormItem>
          <FormItem key="budgetType" labelCol={{span: 5}} wrapperCol={{span: 15}} label="收支类型">
            {
              form.getFieldDecorator('budgetType', {
                rules: [{
                  required: true,
                  message: '请选择收支类型',
                }],
              })(
                <Select placeholder="请选择">
                  <Option value="0">收入</Option>
                  <Option value="1">支出</Option>
                </Select>,
              )
            }
          </FormItem>
          <FormItem key="budgetAmount" labelCol={{span: 5}} wrapperCol={{span: 15}} label="收支金额">
            {form.getFieldDecorator('budgetAmount', {
              rules: [
                {
                  required: true,
                  message: "test",
                },
                {validator: this.validatorPhone},
              ],
            })(<AmountView form={form}/>)}
          </FormItem>
          <FormItem key="budgetDate" labelCol={{span: 5}} wrapperCol={{span: 15}} label="收支时间">
            {form.getFieldDecorator('budgetDate', {
              rules: [{required: true, message: '请选择收支时间！'}],
            })(
              <DatePicker
                style={{width: '100%'}}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择收支时间"
              />
            )}
          </FormItem>
          <FormItem key="reason" labelCol={{span: 5}} wrapperCol={{span: 15}} label="收支备注">
            {form.getFieldDecorator('reason', {})(<Input placeholder="请输入收支备注"/>)}
          </FormItem>
          <FormItem key="approver" labelCol={{span: 5}} wrapperCol={{span: 15}} label="审批人">
            {form.getFieldDecorator('approver', {})(<Input placeholder="请输入审批人"/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

@connect(({budgetProfile, loading}) => ({
  budgetProfile,
  loading: loading.effects['budgetProfile/queryWorkerBudget'],
}))

class BudgetProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      updateModalVisible: false,
      rowValues: {},
      year: 0,
      month: 0,
    };
  }

  componentDidMount() {
    const {dispatch, match} = this.props;
    const {params} = match;
    const queryParams = {
      year: thisYear,
      month: thisMonth,
      workerId: params.id,
      orderByField: 'budget_date',
      orderByType: 1,
    };
    this.setState({
      year: thisYear,
      month: thisMonth,
    });
    dispatch({
      type: 'budgetProfile/queryWorkerBudget',
      payload: queryParams,
    });

  }

  onMonthChange = (date, dateString) => {
    const {dispatch, match} = this.props;
    const {params} = match;
    const ts = dateString.split('-');
    const year = ts[0];
    const month = ts[1];
    const queryParams = {
      workerId: params.id,
      year: year,
      month: month,
      orderByField: 'budget_date',
      orderByType: 1,
    };
    this.setState({
      year: year,
      month: month,
    });
    dispatch({
      type: 'budgetProfile/queryWorkerBudget',
      payload: queryParams,
    });
  };

  handleAdd = fields => {
    const {dispatch, match} = this.props;
    const {params} = match;
    const {budgetAmount} = fields;
    const values = budgetAmount.split('-');
    const amount_wan = parseInteger(values[0]);
    const amount_qian = parseInteger(values[1]);
    const amount_bai = parseInteger(values[2]);
    const amount_shi = parseInteger(values[3]);
    const amount_yuan = parseInteger(values[4]);
    fields.budgetAmount = amount_wan * 10000 + amount_qian * 1000 + amount_bai * 100 + amount_shi * 10 + amount_yuan;
    dispatch({
      type: 'budgetProfile/addWorkerBudget',
      payload: {
        workerId: params.id,
        year: this.state.year,
        month: this.state.month,
        ...fields
      },
    });
    message.success('添加成功');
    this.handleAddModalVisible();
  };

  handleAddModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag,
    });
  };

  handleUpdate = fields => {
    const {dispatch, match} = this.props;
    const {params} = match;
    const {budgetAmount} = fields;
    const values = budgetAmount.split('-');
    const amount_wan = parseInteger(values[0]);
    const amount_qian = parseInteger(values[1]);
    const amount_bai = parseInteger(values[2]);
    const amount_shi = parseInteger(values[3]);
    const amount_yuan = parseInteger(values[4]);
    fields.budgetAmount = amount_wan * 10000 + amount_qian * 1000 + amount_bai * 100 + amount_shi * 10 + amount_yuan;
    dispatch({
      type: 'budgetProfile/updateWorkerBudget',
      payload: {
        workerId: params.id,
        year: this.state.year,
        month: this.state.month,
        ...fields
      },
    });
    message.success('添加成功');
    this.handleUpdateModalVisible();
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      rowValues: record || {},
    });
  };

  handleDelete = budgetId => {
    Modal.confirm({
      title: '删除操作',
      content: '确认删除收支信息吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const {dispatch, match} = this.props;
        const {params} = match;
        const payload = {
          workerId: params.id,
          budgetId: budgetId,
          year: this.state.year,
          month: this.state.month,
        };
        dispatch({
          type: 'budgetProfile/deleteWorkerBudget',
          payload: payload,
        });
        message.success('删除成功');
        this.setState({
          checkedList: [],
          checkAll: false,
        });
      },
    });
  };

  progressColumns = () => {
    return [
      {
        title: '类型',
        dataIndex: 'budgetType',
        key: 'budgetType',
        render(val) {
          return <Badge status={statusMap[val]} text={budgetType[val]}/>;
        },
      },
      {
        title: '金额(元)',
        dataIndex: 'budgetAmount',
        key: 'budgetAmount',
      },
      {
        title: '发生时间',
        dataIndex: 'budgetDate',
        key: 'budgetDate',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '原因',
        dataIndex: 'reason',
        key: 'reason',
      },
      {
        title: '审批人',
        dataIndex: 'approver',
        key: 'approver',
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Fragment>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>*/}
            {/*<Divider type="vertical"/>*/}
            <a onClick={() => this.handleDelete(record.budgetId)}>删除</a>
          </Fragment>
        ),
      },
    ];
  };


  render() {
    const {budgetProfile = {}, loading} = this.props;
    const {budgetData = [], budgetNote = {}, workerData = {}} = budgetProfile;
    const {addModalVisible, updateModalVisible, rowValues} = this.state;
    const sum = budgetNote.total;
    const extraContent = (
      <div className={styles.extraContent}>
        <span style={{fontSize: 20, marginRight: 10}}>总计:{sum}</span>
        <Button icon="plus" type="primary" onClick={() => this.handleAddModalVisible(true)}>
          新建
        </Button>
      </div>
    );
    const titleExpand = (
      <div>
        <MonthPicker disabledDate={disabledDate} defaultValue={moment(thisYear + '-' + thisMonth, monthFormat)}
                     onChange={this.onMonthChange}
                     format={monthFormat} placeholder="选择月份"/>
        <span style={{marginLeft: 10}}>收支详情</span>
      </div>
    );
    const addModalMethods = {
      handleAdd: this.handleAdd,
      handleAddModalVisible: this.handleAddModalVisible,
      workerData: workerData,
    };
    const updateModalMethods = {
      handleUpdate: this.handleUpdate,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      workerData: workerData,
    };
    return (
      <PageHeaderWrapper title="工人收支详情页" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="工人信息" style={{marginBottom: 32}}>
            <Description term="工人姓名">{workerData.workerName}</Description>
            <Description term="工人工种">{workerTypeMap[workerData.workerType]}</Description>
          </DescriptionList>
        </Card>
        <Divider style={{marginBottom: 32}}/>
        <Card title={titleExpand} bordered={false} extra={extraContent}>
          <Table
            style={{marginBottom: 16}}
            pagination={false}
            loading={loading}
            dataSource={budgetData}
            columns={this.progressColumns()}
          />
        </Card>
        <CreateForm {...addModalMethods} modalVisible={addModalVisible}/>
        <UpdateForm {...updateModalMethods} modalVisible={updateModalVisible} values={rowValues}/>
      </PageHeaderWrapper>

    );
  }
}

export default BudgetProfile;
