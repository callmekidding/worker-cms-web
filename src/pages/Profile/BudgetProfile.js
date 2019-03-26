import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Button } from 'antd';
import moment from 'moment';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BasicProfile.less';

const { Description } = DescriptionList;

const budgetType = ['收入', '支出'];
const statusMap = ['success', 'error'];

const progressColumns = [
  {
    title: '类型',
    dataIndex: 'budgetType',
    key: 'budgetType',
    render(val) {
      return <Badge status={statusMap[val]} text={budgetType[val]} />;
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

@connect(({ budgetProfile, loading }) => ({
  budgetProfile,
  loading: loading.effects['budgetProfile/queryWorkerBudget'],
}))

class BudgetProfile extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1;
    const queryParams = {
      year:thisYear,
      month:thisMonth,
      workerId :params.id,
      orderByField:'budget_date',
      orderByType:1,
    };

    dispatch({
      type: 'budgetProfile/queryWorkerBudget',
      payload: queryParams,
    });
  }

  render() {

    const { budgetProfile = {}, loading } = this.props;
    console.log('budgetProfile');
    console.log(budgetProfile);
    const { data = {}} = budgetProfile;
    const sum = data.note.total;
    const extraContent = (
      <div className={styles.extraContent}>
        <span style={{fontSize:20, marginRight: 10}}>总计:{sum}</span>
        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
          新建
        </Button>
      </div>
    );
    return (
      <PageHeaderWrapper title="工人收支详情页" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="工人信息" style={{ marginBottom: 32 }}>
            <Description term="工人姓名">{}</Description>
            <Description term="状态">{}</Description>
            <Description term="销售单号">{}</Description>
            <Description term="子订单">{}</Description>
          </DescriptionList>
        </Card>
        <Divider style={{ marginBottom: 32 }} />
        <Card title="收支详情" bordered={false} extra={extraContent}>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={data.data}
            columns={progressColumns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BudgetProfile;
