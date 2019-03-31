import React, {Component, PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Badge, Table, Divider, Button, Input, InputNumber, Form, Select, DatePicker, Modal, message} from 'antd';
import moment from 'moment';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BasicProfile.less';

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

const progressColumns = [
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

];

function disabledDate(current) {
  return current && current > moment().endOf('day');
}

@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      budgetAmount_wan: 0,
      budgetAmount_qian: 0,
      budgetAmount_bai: 0,
      budgetAmount_shi: 0,
      budgetAmount_yuan: 0,
    };
    this.formLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };
  }

  okHandle = () => {
    const {form, handleAdd} = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue');
      console.log(fieldsValue);
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  handleOnChange = (value, type) => {
    this.setState({

    });
    console.log('this.state');
    console.log(this.state);
  };

  handleOnValuesChange = (props, changedValues, allValues) => {
    console.log('props');
    console.log(props);
    console.log('changedValues');
    console.log(changedValues);
    console.log('allValues');
    console.log(allValues);
  };

  render() {

    const {modalVisible, form, handleAddModalVisible, workerData} = this.props;
    return (
      <Modal
        width={600}
        destroyOnClose
        title="新增收支信息"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleAddModalVisible()}
      >
        <Form {...this.formLayout}>
          <FormItem key="workerName" labelCol={{span: 5}} wrapperCol={{span: 15}} label="工人姓名">
            {form.getFieldDecorator('workerName', {
              initialValue: workerData.workerName,
            })(<Input disabled={true}/>)}
          </FormItem>
          <FormItem onValuesChange={this.handleOnValuesChange} onFieldsChange={this.handleOnValuesChange}
                    key="budgetType" labelCol={{span: 5}} wrapperCol={{span: 15}} label="收支类型">
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
          <FormItem onFieldsChange={this.handleOnValuesChange} key="budgetAmount" labelCol={{span: 5}}
                    wrapperCol={{span: 15}} label="收支数额">
            <FormItem style={{display: 'inline-block'}}>
              {form.getFieldDecorator('budgetAmount-wan', {initialValue:0})(
                <InputNumber size="small" style={{width: 50}} min={0} max={100} defaultValue={0}/>
              )}
            </FormItem>
            <span style={{margin: 2}}>万</span>
            <FormItem style={{display: 'inline-block'}}>
              {form.getFieldDecorator('budgetAmount-qian', {initialValue:0})(<div>
                <InputNumber size="small" style={{width: 50}} min={0} max={9} defaultValue={0}/>
                <span style={{margin: 2}}>千</span>
              </div>)}
            </FormItem>
            <FormItem style={{display: 'inline-block'}}>
              {form.getFieldDecorator('budgetAmount-bai', {initialValue:0})(<div>
                <InputNumber size="small" style={{width: 50}} min={0} max={9} defaultValue={0}/>
                <span style={{margin: 2}}>百</span>
              </div>)}
            </FormItem>
            <FormItem style={{display: 'inline-block'}}>
              {form.getFieldDecorator('budgetAmount-shi', {initialValue:0})(<div>
                <InputNumber size="small" style={{width: 50}} min={0} max={9} defaultValue={0}/>
                <span style={{margin: 2}}>十</span>
              </div>)}
            </FormItem>
            <FormItem style={{display: 'inline-block'}}>
              {form.getFieldDecorator('budgetAmount-yuan', {initialValue:0})(<div>
                <InputNumber size="small" style={{width: 50}} min={0} max={9} defaultValue={0}/>
                <span style={{margin: 2}}>元</span>
              </div>)}
            </FormItem>
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

    dispatch({
      type: 'budgetProfile/queryWorkerBudget',
      payload: queryParams,
    });
  };

  handleAdd = fields => {
    const {dispatch} = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
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

  render() {
    const {budgetProfile = {}, loading} = this.props;
    const {budgetData = [], budgetNote = {}, workerData = {}} = budgetProfile;
    const {addModalVisible} = this.state;
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
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleAddModalVisible: this.handleAddModalVisible,
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
            columns={progressColumns}
          />
        </Card>
        <CreateForm {...parentMethods} modalVisible={addModalVisible}/>
      </PageHeaderWrapper>

    );
  }
}

export default BudgetProfile;
