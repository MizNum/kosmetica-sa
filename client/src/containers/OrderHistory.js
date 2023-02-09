import React, { useEffect } from 'react';
import { PageHeader, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useOrders from '../_actions/orderActions';
import moment from 'moment'
const OrderHistory = () => {
    const navigate = useNavigate();
    const { getOrderHistory } = useOrders();
    const orderHistory = useSelector(state => state.order?.orderHistory);
    const renderOrderList = () => {
        return (
            <Table
                columns={columns}
                dataSource={orderHistory}
                rowKey='_id'
                expandable={expendedRowRender} />
        )
    }

    const columns = [
        { title: 'ID', key: '_id', dataIndex: '_id' },
        {
            title: 'Date', key: 'orderDate', dataIndex: 'orderDate', align: 'center',
            render: (value) => {
                const dateFormat = moment(value).format('DD-MM-YYYY');
                return dateFormat;
            },
        },
        { title: 'Total Amount ($)', key: 'totalAmount', dataIndex: 'totalAmount', align: 'right' }
    ];

    const expendedRowRender = (record) => {
        const columns = [
            {
                title: 'Products', dataIndex: '_product', key: '_product', render: (item) => {
                    return item?.name
                }
            },
            { title: 'Price', dataIndex: 'price', key: 'price', align: 'right' },
            { title: 'Quanity', dataIndex: 'quanity', key: 'quanity', align: 'right' },
            { title: 'Amount ($)', dataIndex: 'amount', key: 'amount', align: 'right' },
        ];
        return  (<Table columns={columns} dataSource={record?.orderDetails} pagination={false} /> )
    }

    //get order history
    useEffect(() => {
        getOrderHistory();
    }, []);
    return (
        <>
            <PageHeader title='Your Order History' onBack={() => navigate(-1)} />
            <div className='page-wrapper'>
                {renderOrderList()}
            </div>
        </>
    )
}

export default OrderHistory;