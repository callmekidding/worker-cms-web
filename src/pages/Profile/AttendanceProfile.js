import React, {Component, PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Badge, Table, Divider, Calendar, Form, Modal, Input} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BasicProfile.less';

const {Description} = DescriptionList;
const FormItem = Form.Item;

@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.formLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };
  }

  okHandle = () => {
    const {form, handleAdd} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
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
            })(<Input disabled={true}/>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

@connect(({attendanceProfile, loading}) => ({
  attendanceProfile,
  loading: loading.effects['attendanceProfile/queryWorkerBudget'],
}))
class AttendanceProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
    };
  }

  componentDidMount() {
    const {dispatch, match} = this.props;
    const {params} = match;

    dispatch({
      type: 'profile/queryWorkerBudget',
      payload: params.id || '1000000000',
    });
  };

  getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          {type: 'warning', content: 'This is warning event.'},
          {type: 'success', content: 'This is usual event.'},
        ];
        break;
      case 10:
        listData = [
          {type: 'warning', content: 'This is warning event.'},
          {type: 'success', content: 'This is usual event.'},
          {type: 'error', content: 'This is error event.'},
        ];
        break;
      case 15:
        listData = [
          {type: 'warning', content: 'This is warning event'},
          {type: 'success', content: 'This is very long usual event。。....'},
          {type: 'error', content: 'This is error event 1.'},
          {type: 'error', content: 'This is error event 2.'},
          {type: 'error', content: 'This is error event 3.'},
          {type: 'error', content: 'This is error event 4.'},
        ];
        break;
      default:
    }
    return listData || [];
  };

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul className="ant-fullcalendar-selected-day">
        {
          listData.map(item => (
            <li key={item.content}>
              <Badge status={item.type} text={item.content}/>
            </li>
          ))
        }
      </ul>
    );
  };

  getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  }

  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  handleOnSelect = (value) => {
    this.setState({
      addModalVisible: true,
    });
  };

  render() {
    const {attendanceProfile = {}, loading} = this.props;
    const {addModalVisible} = this.state;
    return (
      <PageHeaderWrapper title="工人收支详情页" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="工人信息" style={{marginBottom: 32}}>
            <Description term="工人姓名">{}</Description>
            <Description term="工人工种">{}</Description>
          </DescriptionList>
        </Card>
        <Divider style={{marginBottom: 32}}/>
        <Card title="出勤详情" bordered={false}>
          <Calendar onSelect={this.handleOnSelect} dateCellRender={this.dateCellRender}
                    monthCellRender={this.monthCellRender}/>
        </Card>
        <CreateForm modalVisible={addModalVisible}/>
      </PageHeaderWrapper>
    );
  }
}

export default AttendanceProfile;
