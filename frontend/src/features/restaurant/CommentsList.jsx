import { Comment, Form, message, Rate } from 'antd';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../auth/AuthContext';
import { ReplyEditor } from './Editors';
import { addReply } from './reviewSlice';
import { roles } from '../../settings';
import ConfirmDeleteReview from './ConfirmDeleteReview';
import { EditOutlined } from '@ant-design/icons';
import { generatePhoto, momentize } from '../../helpers/helper';

const { useForm } = Form;

export const CommentsList = ({
  item,
  restaurant_id,
  owner_id,
  isHighlight,
  passToModal,
  ownerImage,
  index,
}) => {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const { user } = auth;
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  let { author, comment, rating, date, reply } = item;
  const handleSubmit = async () => {
    setLoading(true);
    comment = comment.trim();

    try {
      const values = await form.validateFields();
      await dispatch(
        addReply({
          values,
          review_id: item._id,
          auth,
          restaurant_id,
          message,
        })
      );
      setLoading(false);
      // form.resetFields();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <Comment
      actions={
        !isHighlight && [
          !reply.message && owner_id === user._id && (
            <span
              onClick={() => setShowEditor(!showEditor)}
              key="comment-nested-reply-to"
            >
              Reply to
            </span>
          ),
          user.role === roles.admin && (
            <EditOutlined
              style={{
                color: '#1890ff',
              }}
              onClick={() => passToModal(item)}
            />
          ),
          user.role === roles.admin && (
            <ConfirmDeleteReview review_id={item._id} />
          ),
        ]
      }
      author={author.name}
      avatar={generatePhoto(index)}
      content={
        <div>
          <Rate style={{ color: '#ffa41c' }} value={rating} disabled />
          <p>{comment}</p>
        </div>
      }
      datetime={momentize(date)}
    >
      {!isHighlight && reply.message && (
        <Comment
          author={reply.author.name}
          content={<p>{reply.message}</p>}
          datetime={momentize(reply.date)}
          avatar={ownerImage}
        />
      )}
      {!reply.message && owner_id === user._id && showEditor && (
        <ReplyEditor
          handleSubmit={handleSubmit}
          loading={loading}
          form={form}
        />
      )}
    </Comment>
  );
};
