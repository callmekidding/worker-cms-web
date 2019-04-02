import React, {Component, PureComponent} from 'react';
import {connect} from 'dva';
import {
  Card,
  Badge,
  Menu,
  Divider,
  Calendar,
  Form,
  Modal,
  Input,
  Checkbox,
  Button,
  Dropdown,
  Icon,
  message
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import styles from './BasicProfile.less';
import {fixedZero} from "../../utils/utils";
import {getTimeDistance} from '@/utils/utils';

const {Description} = DescriptionList;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;


const workerTypeMap = ['大工', '小工'];

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
class AttendanceProfile extends PureComponent {
  state = {
    checkedList: [],
    checkAll: false,
    monthRange: [],
    monthDayAmount: 0,
    checkAllList: [],
  };

  componentDidMount() {
    const thisMonthRange = getTimeDistance('month');
    const thisMonthDayAmount = thisMonthRange[1].date() - thisMonthRange[0].date();
    const thisYear = thisMonthRange[0].year();
    const thisMonth = thisMonthRange[0].month() + 1;
    const checkAllList = this.fillArray(thisYear, thisMonth, thisMonthDayAmount);
    const {dispatch, match} = this.props;
    const {params} = match;
    this.setState({
      monthRange: thisMonthRange,
      monthDayAmount: thisMonthDayAmount,
      checkAllList: checkAllList,
    });
    const queryParams = {
      attendanceYear: thisYear,
      attendanceMonth: thisMonth,
      workerId: params.id,
    };
    dispatch({
      type: 'attendanceProfile/queryWorkerAttendance',
      payload: queryParams,
    });
  };

  fillArray = (year, month, index) => {
    let array = new Array(index);
    for (let i = 0; i < index; i++) {
      array[i] = year + '-' + month + '-' + (i + 1);
    }
    return array;
  };

  dateCellRender = (cell, days, month, year) => {
    // console.log('cell');
    // console.log(cell);
    // console.log('days');
    // console.log(days);
    // console.log('year');
    // console.log(year);
    // console.log('month');
    // console.log(month);
    const {monthRange} = this.state;
    const date = cell.date();
    const today = moment().endOf('day');
    const cellYear = cell.year();
    const cellMonth = cell.month() + 1;
    const fullDate = cellYear + '-' + cellMonth + '-' + date;
    // console.log('cellMonth');
    // console.log(cellMonth);
    // console.log('fullDate');
    // console.log(fullDate);
    // console.log('judge year');
    // console.log(year === cellYear);
    // console.log('judge month');
    // console.log(month === cellMonth);
    // console.log('judge date1');
    // console.log(cell <= today);
    let background;
    let checkBox = null;
    // 判断是否有多选框
    if (cell >= monthRange[0] && cell <= monthRange[1] && cell <= today) {
      const checked = this.state.checkAll || this.state.checkedList.indexOf(fullDate) >= 0;
      checkBox = <Checkbox checked={checked} value={fullDate} onChange={this.handleOnChange}> </Checkbox>;
    }
    // 判断是否加出勤样式
    if (year === cellYear && month === cellMonth && cell <= today) {
      const contains = days && days.indexOf(fullDate) >= 0;
      background = contains ? '#09cc33' : '#f30920';
    }

    return (
      <div className="ant-fullcalendar-date">
        {checkBox}
        <div className="ant-fullcalendar-value"
             style={{fontSize: '20px', color: background}}>{date}</div>
      </div>
    );
  };

  handleOnChange = (e) => {
    const checkedListSlice = this.state.checkedList.slice();
    const value = e.target.value;
    const {monthDayAmount} = this.state;
    if (e.target.checked && checkedListSlice.indexOf(value) < 0) {
      checkedListSlice.push(value);
    } else if (!e.target.checked && checkedListSlice.indexOf(value) >= 0) {
      checkedListSlice.splice(checkedListSlice.indexOf(value), 1);
    }

    this.setState({
      checkedList: checkedListSlice,
      checkAll: checkedListSlice.length === monthDayAmount,
    });

  };

  handleOnSelect = (value) => {

  };

  handleOnPanelChange = (select, mode) => {
    const year = select.year();
    const month = select.month() + 1;
    const lastDay = select.endOf('month');
    const firstDay = moment(`${year}-${fixedZero(month)}-01 00:00:00`);
    const {dispatch, match} = this.props;
    const {params} = match;
    const monthRange = [firstDay, lastDay];
    const monthDayAmount = lastDay.date() - firstDay.date() + 1;
    const checkAllList = this.fillArray(year, month, monthDayAmount);
    this.setState({
      monthRange: monthRange,
      monthDayAmount: monthDayAmount,
      checkAllList: checkAllList,
    });
    const queryParams = {
      attendanceYear: year,
      attendanceMonth: month,
      workerId: params.id,
    };
    dispatch({
      type: 'attendanceProfile/queryWorkerAttendance',
      payload: queryParams,
    });
  };


  disabledDate = (current) => {
    return current < this.state.monthRange[0] || current > this.state.monthRange[1];
  };

  onCheckAllChange = (e) => {
    const {checkAllList} = this.state;
    this.setState({
      checkedList: e.target.checked ? checkAllList : [],
      checkAll: e.target.checked,
    });
  };

  handleMenuClick = e => {
    const key = e.key;
    const props = this.props;
    const state = this.state;
    let content = '确认设置为';
    if (key === 'remove') {
      content += '缺勤吗？';
    } else if (key === 'add') {
      content += '出勤吗？';
    }
    Modal.confirm({
      title: '批量操作',
      content: content,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const {dispatch, match} = this.props;
        const {params} = match;

        const {checkedList, monthRange} = this.state;
        const firstDay = monthRange[0];
        const year = firstDay.year();
        const month = firstDay.month() + 1;
        const payload = {
          workerId: params.id,
          attendanceType: e.key,
          attendanceDayList: checkedList,
          attendanceYear: year,
          attendanceMonth: month,
        };
        dispatch({
          type: 'attendanceProfile/insertOrUpdateWorkerAttendance',
          payload: payload,
        });
        message.success('设置成功');
        this.setState({
          checkedList: [],
          checkAll: false,
        });
      },
    });

  };


  render() {
    const {attendanceProfile = {}, loading} = this.props;
    const {attendanceData = {}, workerData = {}} = attendanceProfile;
    const {attendanceYear, attendanceMonth, attendanceDayList} = attendanceData;
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="add">设为出勤</Menu.Item>
        <Menu.Item key="remove">设为缺勤</Menu.Item>
      </Menu>
    );
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
      <div>
        <Checkbox
          onChange={this.onCheckAllChange}
          checked={this.state.checkAll}
        >
          全选
        </Checkbox>
        <Dropdown overlay={menu}>
          <Button>
            批量操作 <Icon type="down"/>
          </Button>
        </Dropdown>
      </div>);
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
          <Calendar disabledDate={this.disabledDate}
                    onSelect={this.handleOnSelect}
                    onPanelChange={this.handleOnPanelChange}
                    dateFullCellRender={e => this.dateCellRender(e, attendanceDayList, attendanceMonth, attendanceYear)
                    }
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AttendanceProfile;
