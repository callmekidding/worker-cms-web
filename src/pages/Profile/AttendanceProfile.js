import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BasicProfile.less';

const { Description } = DescriptionList;

const progressColumns = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text =>
      text === 'success' ? (
        <Badge status="success" text="成功" />
      ) : (
        <Badge status="processing" text="进行中" />
      ),
  },
  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
  },
];

@connect(({ attendanceProfile, loading }) => ({
  attendanceProfile,
  loading: loading.effects['attendanceProfile/queryWorkerBudget'],
}))
class AttendanceProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;

    dispatch({
      type: 'profile/queryWorkerBudget',
      payload: params.id || '1000000000',
    });
  }

  render() {
    const { attendanceProfile = {}, loading } = this.props;
    const { basicProgress = [], userInfo = {}, application = {} } = attendanceProfile;
    return (
      <PageHeaderWrapper title="工人收支详情页" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="工人信息" style={{ marginBottom: 32 }}>
            <Description term="工人姓名">{application.id}</Description>
            <Description term="状态">{application.status}</Description>
            <Description term="销售单号">{application.orderNo}</Description>
            <Description term="子订单">{application.childOrderNo}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>收支详情</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={basicProgress}
            columns={progressColumns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AttendanceProfile;
