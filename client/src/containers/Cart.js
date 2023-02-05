import React, { useState } from 'react'
import { PageHeader, Table, Space, Image, Typography, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteTwoTone, EditTwoTone, SaveTwoTone, ReloadOutlined } from '@ant-design/icons';
import useCarts from '../_actions/cartActions';
const Cart = () => {
    const [editItem, setEditItem] = useState(null);
    const [quantity, setQuantity] = useState(null);

    const navigate = useNavigate();
    const { updateCartItem, removeCartItem } = useCarts();
    const dispatch = useDispatch();
    const cartItems = useSelector((state => state.cart.cartItems?.cartDetails));

    const renderCartItems = () => {
        return (
            <Table columns={columns} dataSource={cartItems} scroll={{ x: 1300 }} />
        )
    }
    ///reset
    const handleReset = () => {
        setEditItem(null)
    }
    const handleEdit = (item) => {
        setEditItem(item);
        setQuantity(item.quantity);
    }

    const handleQuantityChange = (value) => {
        setQuantity(value);
    }

    const handleRemove = (item) => {
        dispatch(removeCartItem(item?._product?._id)).then(res => {
            if (res.payload.status) {
                message.success(res.payload.message);
            } else {
                message.error(res.payload.message);
            }
        })
    }

    const handleUpdateCartItem = (item) => {
        const data = {
            _productId: item?._product?._id,
            quantity,
        };
        dispatch(updateCartItem(data)).then((res) => {
            console.log(data)
            if (res.payload.status) {
                message.success(res.payload.message);
                setEditItem(null)
            } else {
                message.error(res.payload.message);
            }
        })
    }
    const columns = [
        {
            title: 'Product',
            width: 80,
            dataIndex: '_product',
            key: 'name',
            render: (item) => {
                return (
                    <Space direction='vertical'>
                        <Typography.Text strong>
                            {item?.name}
                        </Typography.Text>
                        <Image src={item?.image} alt='img' width={80} />
                    </Space>
                )
            },
            fixed: 'left'
        },
        {
            title: 'Price ($)',
            width: 100,
            dataIndex: 'price',
            key: 'price',
            align: 'right'
        },
        {
            title: 'Quantity',
            width: 100,
            //dataIndex: 'quantity',
            //key: 'quantity',
            align: 'right',
            render: (item) => {
                if (editItem?._product?._id === item?._product?._id) {
                    return (
                        <InputNumber size='small' min={1} value={quantity} onChange={handleQuantityChange} />
                    )
                }
                return <span> {item?.quantity} </span>
            }
        },
        {
            title: 'Amount ($)',
            width: 100,
            dataIndex: 'amount',
            key: 'amount',
            align: 'right'
        },
        {
            title: 'Actions',
            fixed: 'right',
            width: 100,
            render: (item) => {
                return (
                    <>
                        {editItem?._product?._id === item?._product?._id ? (
                            <span style={{ marginRight: 4 }}>
                                <SaveTwoTone style={{ marginRight: 4, fontSize: 16 }} onClick={() => handleUpdateCartItem(item)} />
                                <ReloadOutlined style={{ color: 'green', fontSize: 16 }} onClick={handleReset} />

                            </span>
                        ) : <EditTwoTone style={{ marginRight: 4, fontSize: 16 }} twoToneColor='red' onClick={() => handleEdit(item)} />
                        }
                        <DeleteTwoTone style={{ marginRight: 4, fontSize: 16 }} twoToneColor='yellow' onClick={() => handleRemove(item)} />

                    </>
                )
            }
        }
    ]
    return (
        <>
            <PageHeader title='Your Cart' onBack={() => navigate(-1)} />
            <div className='page-wrapper'>
                {renderCartItems()}
            </div>
        </>
    )
}

export default Cart;