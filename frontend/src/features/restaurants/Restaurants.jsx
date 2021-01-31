import React, { useContext, useEffect, useState } from 'react';
import { List, Rate, Space, Tag, Form, Grid } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import './style.scss';
import Filter from './Filter';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRestaurants,
  selectAllRestaurants,
  selectTotal,
} from './restaurantSlice';
import { AuthContext } from '../auth/AuthContext';
import {
  EditOutlined,
  ClockCircleOutlined,
  StarFilled,
} from '@ant-design/icons';
import ConfirmDeleteRestaurant from './ConfirmDeleteRestaurant';
import EditRestaurantModal from './EditRestaurantModal';
import { dummyRestauranImage, roles } from '../../settings';
import { useQuery } from '../../helpers/helper';

const { Item } = List;
const { useForm } = Form;
const { useBreakpoint } = Grid;

function Restaurants() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();
  const { md } = useBreakpoint();
  const [form] = useForm();
  const auth = useContext(AuthContext);
  const { user } = auth;
  const dispatch = useDispatch();
  const query = useQuery();
  const restaurants = useSelector(selectAllRestaurants);
  const [pagination, setPagination] = useState(+query.get('page'));
  const [filterVal, setFilterVal] = useState(+query.get('rating'));

  const total = useSelector(selectTotal);

  useEffect(() => {
    const filter = typeof filterVal !== 'number' ? 0 : filterVal;
    const page = typeof pagination !== 'number' ? 1 : pagination;
    dispatch(fetchRestaurants({ auth, filterVal: filter, pagination: page }));
  }, [pagination, filterVal]);

  const passToModal = restaurant => {
    form.setFieldsValue({
      name: restaurant.name,
      restaurant_id: restaurant._id,
    });
    setIsModalVisible(true);
  };

  const handlePagination = page => {
    query.set('page', page);
    history.replace({ ...history.location, search: query.toString() });
    setPagination(page);
  };
  return (
    <div id="restaurants-main">
      <Filter
        setPagination={setPagination}
        filterVal={filterVal}
        setFilterVal={setFilterVal}
      />
      <EditRestaurantModal
        form={form}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      <List
        itemLayout="horizontal"
        dataSource={restaurants}
        pagination={{
          onChange: handlePagination,
          current:
            pagination <= 0 ||
            isNaN(pagination) ||
            typeof pagination !== 'number'
              ? 1
              : pagination,
          pageSize: 10,
          total: Math.ceil(total / 10) < pagination ? 0 : total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          hideOnSinglePage: true,
        }}
        renderItem={(item, index) => (
          <Item
            key={item.title}
            className="list-item"
            actions={[
              user.role === roles.admin && (
                <EditOutlined
                  style={{
                    color: '#1890ff',
                  }}
                  onClick={() => passToModal(item)}
                />
              ),
              user.role === roles.admin && (
                <ConfirmDeleteRestaurant restaurant_id={item._id} />
              ),
            ]}
          >
            <Item.Meta
              avatar={
                <img
                  style={{ width: '150px', paddingLeft: '10px' }}
                  alt="yummy"
                  src={dummyRestauranImage[index % dummyRestauranImage.length]}
                />
              }
              title={
                <Link to={`/restaurant/${item._id}`}>
                  <p>{item.name}</p>
                </Link>
              }
              description={
                <div>
                  <div>
                    <Space wrap>
                      {md ? (
                        <Rate
                          allowHalf
                          style={{ color: '#ffa41c', paddingBottom: 5 }}
                          disabled
                          value={item.rating}
                        />
                      ) : (
                        <StarFilled style={{ color: '#ffa41c' }} />
                      )}

                      <h4 style={{ margin: 0 }}>{item.rating}</h4>
                    </Space>
                  </div>
                  <p>
                    {item.reviews.count}{' '}
                    {item.reviews.count === 1 ? 'review' : 'reviews'}
                  </p>
                  {user._id === item.owner_id &&
                    item.reviews.pending_reply > 0 && (
                      <Tag color="processing" icon={<ClockCircleOutlined />}>
                        {item.reviews.pending_reply}{' '}
                        {item.reviews.count === 1
                          ? 'pending reply'
                          : 'pending replies'}
                      </Tag>
                    )}
                </div>
              }
            />
          </Item>
        )}
      />
    </div>
  );
}

export default Restaurants;
