import React, { useContext, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  fetchSingleRestaurant,
  selectRestaurantById,
  selectRestaurantIndex,
} from '../restaurants/restaurantSlice';
import Reviews from './Reviews';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Image,
  Rate,
  Row,
  Tag,
  Space,
  Popover,
  Grid,
  Breadcrumb,
} from 'antd';
import './style.scss';
import { AuthContext } from '../auth/AuthContext';
import RatingDetail from './RatingDetail';
import { dummyRestauranImage } from '../../settings';
import { HomeOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;

function RestaurantDetail() {
  let history = useHistory();
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const dispatch = useDispatch();
  const restaurant = useSelector(state => selectRestaurantById(state, id));
  const index = useSelector(state => selectRestaurantIndex(state, id));
  const { md } = useBreakpoint();

  useEffect(() => {
    if (!restaurant) {
      dispatch(fetchSingleRestaurant({ auth, restaurant_id: id, history }));
    }
  }, []);

  const MainBreadCrumb = () => {
    return (
      <Breadcrumb
        style={{
          padding: '50px 10px 50px 10px',
        }}
      >
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined style={{ fontSize: '17px' }} />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ fontSize: '17px' }}>
          {restaurant.name}
        </Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  return restaurant ? (
    <div id="restaurant-detail">
      <MainBreadCrumb />
      <Row align="middle">
        <Col>
          <Image
            style={{ border: '1px solid #cfced5', borderRadius: '50%' }}
            width={100}
            src={dummyRestauranImage[index % dummyRestauranImage.length]}
          />
        </Col>
        <Col md={6} style={{ paddingLeft: '10px' }}>
          <h1 id="restaurant-name">{restaurant.name}</h1>
          <div>
            <Space align="center">
              <Rate
                allowHalf
                disabled
                value={restaurant.rating}
                style={{ color: '#ffa41c' }}
              />
              <h4 style={{ margin: 0, paddingTop: 5 }}>{restaurant.rating}</h4>
            </Space>
          </div>
          <div style={{ paddingTop: 10 }}>
            <Space>
              <p id="count-review">
                {restaurant.reviews.count}{' '}
                {restaurant.reviews.count === 1 ? 'review' : 'reviews'}
              </p>

              <Popover
                placement={md ? 'right' : 'bottom'}
                content={<RatingDetail restaurant_id={restaurant._id} />}
                title="Rating Details"
              >
                <Tag color="magenta">Details</Tag>
              </Popover>
            </Space>
          </div>
        </Col>
      </Row>
      <Reviews restaurant={restaurant} />
    </div>
  ) : null;
}

export default RestaurantDetail;
