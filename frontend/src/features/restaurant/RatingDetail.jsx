import { Col, Progress, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { countByRating, selectAllReviewsByRestaurant } from './reviewSlice';

function RatingSingle({ restaurant_id, rating }) {
  const count = useSelector(state =>
    countByRating(state, restaurant_id, rating)
  );
  const allReviews = useSelector(state =>
    selectAllReviewsByRestaurant(state, restaurant_id)
  );

  const calculatePercent = single => {
    return (
      (single / (typeof allReviews === 'undefined' ? 0 : allReviews.length)) *
      100
    );
  };
  return (
    <div style={{ width: '270px' }}>
      <Row>
        <Col span={4}>
          {rating} {rating === 1 ? 'star' : 'stars'}
        </Col>
        <Col span={20}>
          <Progress
            strokeColor="#f43939"
            percent={calculatePercent(count)}
            size="small"
            format={percent => `${count}`}
          />
        </Col>
      </Row>
    </div>
  );
}

function RatingDetail({ restaurant_id }) {
  return [5, 4, 3, 2, 1].map(item => (
    <RatingSingle key={item} restaurant_id={restaurant_id} rating={item} />
  ));
}

export default RatingDetail;
