import React, { useContext, useState } from 'react';
import { Button, Col, Rate, Row } from 'antd';
import AddRestaurant from './AddRestaurant';
import { AuthContext } from '../auth/AuthContext';
import { roles } from '../../settings';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../../helpers/helper';

function Filter({ setPagination, setFilterVal, filterVal }) {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  let query = useQuery();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleFilter = val => {
    if (val === +filterVal || val === 0) {
      val = 0;
      query.delete('rating');
    } else {
      query.set('rating', val);
    }
    query.set('page', 1);
    setPagination(1);
    setFilterVal(val);
    history.replace({ search: query.toString() });
  };
  return (
    <>
      <Row justify="space-between" style={{ padding: '20px 0' }}>
        <Col>
          {user.role === roles.owner && (
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
              Add a restaurant
            </Button>
          )}
        </Col>
        <Col className="right-col">
          <div className="parent">
            <span className="label">Rated at least:</span>
            <Rate
              value={filterVal}
              onChange={handleFilter}
              style={{ paddingBottom: '7px' }}
            />
          </div>
        </Col>
      </Row>
      <AddRestaurant
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  );
}

export default Filter;
