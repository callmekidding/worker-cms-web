import React, {Component, PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Badge, Table, Divider, Button, Input, Form, Calendar, DatePicker, Modal, message} from 'antd';
import moment from 'moment';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BasicProfile.less';

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
  // Can not select days before today and today
  return current && current > moment().endOf('day');
}


const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleAddModalVisible, workerData} = props;
  console.log(workerData);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增收支信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleAddModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="工人姓名">
        {form.getFieldDecorator('workerName', {
          rules: [{required: true, message: '请输入至少两个字的名字！', min: 2}],
          initialValue: workerData.workerName,
        })(<Input disabled={true}/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="工人姓名">
        {form.getFieldDecorator('workerName', {
          rules: [{required: true, message: '请输入至少两个字的名字！', min: 2}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
    </Modal>
  );
});

@connect(({budgetProfile, loading}) => ({
  budgetProfile,
  loading: loading.effects['budgetProfile/queryWorkerBudget'],
}))

class BudgetProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workerData: {},
      addModalVisible: false,
    };
  }

  componentDidMount() {
    const {dispatch, match} = this.props;
    const {params} = match;
    this.setState(
      {
        workerData: {
          workerId: params.id
        }
      }
    );
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
    const {dispatch} = this.props;
    const ts = dateString.split('-');
    const year = ts[0];
    const month = ts[1];
    const queryParams = {
      workerId: this.state.workerData.workerId,
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
      workerData: this.state.workerData,
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
