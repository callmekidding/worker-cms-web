import React, {Component, PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Badge, Table, Divider, Calendar, Form, Modal, Input, Checkbox} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import styles from './BasicProfile.less';
import {fixedZero} from "../../utils/utils";
import {getTimeDistance} from '@/utils/utils';

const {Description} = DescriptionList;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const thisMonth = getTimeDistance('month');
const thisMonthDayAmount = thisMonth[1].date() - thisMonth[0].date();
const checkAllList = thisMonthDayAmount => {

};


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
            {form.getFieldDecorator('workerName', {})(<Input disabled={true}/>)}
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
      checkedList: [],
      indeterminate: true,
      checkAll: false,
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

  dateCellRender = (value, days, month, year) => {
    const date = value.date();
    const fullDate = value.year() + '-' + (value.month() + 1) + '-' + date;
    let background;
    let thisMonth = null;
    // 当前月加背景色
    if (year === value.year() && month === (value.month() + 1)) {
      const contains = days && days.indexOf(fullDate) >= 0;
      background = contains ? '#09cc33' : '#f30920';
      const checked = this.state.checkAll || this.state.checkedList.indexOf(date) >= 0;
      thisMonth = <Checkbox checked={checked} value={date} onChange={this.handleOnChange}> </Checkbox>;
    }
    return (
      <div className="ant-fullcalendar-date">
        {thisMonth}
        <div className="ant-fullcalendar-value"
             style={{fontSize: '20px', color: background}}>{date}</div>
      </div>
    );
  };

  handleOnChange = (e) => {
    const checkedListSlice = this.state.checkedList.slice();
    const value = e.target.value;
    if (e.target.checked && checkedListSlice.indexOf(value) < 0) {
      checkedListSlice.push(value);
    } else if (!e.target.checked && checkedListSlice.indexOf(value) >= 0) {
      checkedListSlice.splice(checkedListSlice.indexOf(value), 1);
    }
    this.setState({
      checkedList: checkedListSlice,
      checkAll: checkedListSlice.length === thisMonthDayAmount
    });
    console.log('this.state');
    console.log(this.state);
  };

  handleOnSelect = (value) => {
    this.setState({
      addModalVisible: true,
    });
  };


  disabledDate = (current) => {
    return current < thisMonth[0] || current > thisMonth[1];
  };

  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < thisMonthDayAmount),
      checkAll: checkedList.length === thisMonthDayAmount,
    });
  };
  onCheckAllChange = (e) => {
    this.setState({
      // checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };


  render() {
    const {attendanceProfile = {}, loading} = this.props;
    const {addModalVisible} = this.state;
    const days = ['2019-3-1', '2019-3-2', '2019-3-5', '2019-3-12', '2019-3-7', '2019-3-10', '2019-3-25', '2019-3-19', '2019-3-26', '2019-3-15', '2019-3-22', '2019-3-21'];
    const month = 3;
    const year = 2019;
    const titleExpand = (
      <div>
        <span>出勤详情</span>
        <div
          style={{width: '18px', height: '15px', background: '#09cc33', display: 'inline-block', marginLeft: '10px'}}/>
        <span style={{marginLeft: '10px'}}>出勤</span>
        <div
          style={{width: '18px', height: '15px', background: '#f30920', display: 'inline-block', marginLeft: '10px'}}/>
        <span style={{marginLeft: '10px'}}>缺勤</span>

      </div>
    );

    const extraContent = (
      <div style={{borderBottom: '1px solid #E9E9E9'}}>
        <Checkbox
          indeterminate={this.state.indeterminate}
          onChange={this.onCheckAllChange}
          checked={this.state.checkAll}
        >
          全选
        </Checkbox>
      </div>);
    return (
      <PageHeaderWrapper title="工人收支详情页" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="工人信息" style={{marginBottom: 32}}>
            <Description term="工人姓名">{}</Description>
            <Description term="工人工种">{}</Description>
          </DescriptionList>
        </Card>
        <Divider style={{marginBottom: 32}}/>
        <Card title={titleExpand} bordered={false} extra={extraContent}>
          <Calendar disabledDate={this.disabledDate}
                    onSelect={this.handleOnSelect}
                    dateFullCellRender={e => this.dateCellRender(e, days, month, year)}
          />
        </Card>
        <CheckboxGroup value={this.state.checkedList} onChange={this.onChange}/>
      </PageHeaderWrapper>
    );
  }
}

export default AttendanceProfile;
