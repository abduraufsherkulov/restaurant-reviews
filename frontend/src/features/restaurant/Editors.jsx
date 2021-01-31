import { Button, DatePicker, Form, Input, Rate } from 'antd';

const { TextArea } = Input;
const { Item } = Form;

export const ReplyEditor = ({ handleSubmit, loading, form }) => {
  return (
    <Form form={form}>
      <Item
        name="reply"
        rules={[{ required: true, message: 'Please provide your reply' }]}
      >
        <TextArea rows={4} />
      </Item>
      <Item>
        <Button
          htmlType="submit"
          loading={loading}
          onClick={handleSubmit}
          type="primary"
        >
          Reply
        </Button>
      </Item>
    </Form>
  );
};

export const Editor = ({ onSubmit, loading, form }) => {
  return (
    <Form form={form}>
      <Item rules={[{ required: true, message: 'Please rate' }]} name="rating">
        <Rate />
      </Item>
      <Item
        rules={[{ required: true, message: 'Please choose visited date' }]}
        name="date"
      >
        <DatePicker placeholder="Visited date" />
      </Item>
      <Item
        name="comment"
        rules={[{ required: true, message: 'Please provide your review' }]}
      >
        <TextArea rows={4} />
      </Item>
      <Item>
        <Button
          htmlType="submit"
          loading={loading}
          onClick={onSubmit}
          type="primary"
        >
          Add a review
        </Button>
      </Item>
    </Form>
  );
};
