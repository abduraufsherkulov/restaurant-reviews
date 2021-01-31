import React, { useContext, useEffect, useState } from 'react';
import { Comment, Form, List, message, Divider, Tag, Spin } from 'antd';
import { AuthContext } from '../auth/AuthContext';
import {
  addNewReview,
  fetchReviews,
  selectAllReviewsByRestaurant,
  selectReviewIndex,
} from './reviewSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from './Editors';
import { CommentsList } from './CommentsList';
import { roles } from '../../settings';
import EditReviewModal from './EditReviewModal';
import { generatePhoto } from '../../helpers/helper';

const { useForm } = Form;
function Reviews({ restaurant }) {
  const { _id: restaurant_id, owner_id } = restaurant;

  const [ownerImage] = useState(generatePhoto());
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = useForm();
  const [newForm] = useForm();
  const auth = useContext(AuthContext);
  const { user } = auth;
  const dispatch = useDispatch();
  const reviews = useSelector(state =>
    selectAllReviewsByRestaurant(state, restaurant_id)
  );
  const sortedForHighlight = reviews
    ? reviews.slice().sort((a, b) => b.rating - a.rating)
    : [];

  const reviewIndex1 = useSelector(state =>
    selectReviewIndex(state, restaurant_id, sortedForHighlight[0])
  );
  const reviewIndex2 = useSelector(state =>
    selectReviewIndex(
      state,
      restaurant_id,
      sortedForHighlight[sortedForHighlight.length - 1]
    )
  );

  useEffect(async () => {
    setDataLoading(true);
    await dispatch(
      fetchReviews({
        auth,
        restaurant_id,
        message,
      })
    );
    setDataLoading(false);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      await dispatch(
        addNewReview({
          values,
          auth,
          restaurant_id,
          message,
        })
      );
      form.resetFields();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const passToModal = ({ comment, rating, _id }) => {
    newForm.setFieldsValue({ comment, rating, review_id: _id });
    setIsModalVisible(true);
  };
  return (
    <>
      {reviews && reviews.length > 0 && (
        <>
          {!dataLoading ? (
            <>
              <EditReviewModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                form={newForm}
              />
              <Divider />
              {/* <p>Highest rated review:</p> */}
              <List
                style={{ background: '#f6ffed' }}
                dataSource={[sortedForHighlight[0]]}
                itemLayout="vertical"
                renderItem={item => (
                  <CommentsList
                    item={item}
                    restaurant_id={restaurant_id}
                    owner_id={owner_id}
                    isHighlight={true}
                    index={reviewIndex1}
                  />
                )}
              />
              {sortedForHighlight.length > 1 && (
                <>
                  {/* <p>Highest rated review:</p> */}
                  <List
                    style={{ background: '#fffbe6' }}
                    dataSource={[
                      sortedForHighlight[sortedForHighlight.length - 1],
                    ]}
                    itemLayout="vertical"
                    renderItem={item => (
                      <CommentsList
                        item={item}
                        restaurant_id={restaurant_id}
                        owner_id={owner_id}
                        isHighlight={true}
                        index={reviewIndex2}
                      />
                    )}
                  />
                </>
              )}
              <Divider />
              <List
                dataSource={reviews}
                itemLayout="vertical"
                renderItem={(item, index) => (
                  <CommentsList
                    item={item}
                    restaurant_id={restaurant_id}
                    owner_id={owner_id}
                    isHighlight={false}
                    passToModal={passToModal}
                    ownerImage={ownerImage}
                    index={index}
                  />
                )}
              />
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
            </div>
          )}
        </>
      )}
      {user.role === roles.customer && (
        <>
          <Divider />
          <div>
            Comment as <Tag>{user.username}</Tag>
          </div>
          <Comment
            content={
              <Editor form={form} onSubmit={handleSubmit} loading={loading} />
            }
          />
        </>
      )}
    </>
  );
}

export default Reviews;
