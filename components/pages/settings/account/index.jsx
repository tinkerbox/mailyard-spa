import React from 'react';
import { Collapse, Row, Col, Typography, Alert, Button, Checkbox, Divider } from 'antd';
import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

import styles from '../../../../styles';

const { Panel } = Collapse;
const { Paragraph } = Typography;

const Account = () => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <React.Fragment>

      <Collapse bordered={false} accordion>

        <Panel header="Change your password" className={styles.use('mt-4')}>

          <Row>
            <Col span={12}>

              <Formik>
                <Form layout="horizontal" {...formItemLayout}>

                  <Form.Item label="Current password">
                    <Input.Password name="currentPassword" />
                  </Form.Item>

                  <Form.Item label="New password">
                    <Input.Password name="newPassword" />
                  </Form.Item>

                  <Form.Item label="Confirm new password">
                    <Input.Password name="confirmPassword" />
                  </Form.Item>

                  <Divider dashed />

                  <SubmitButton type="primary" htmlType="submit">Change Password</SubmitButton>

                </Form>
              </Formik>

            </Col>
          </Row>

        </Panel>

        <Panel header="Manage your notifications" className={styles.use('mt-4')}>
          <Paragraph>Lorem ipsum</Paragraph>
        </Panel>

        <Panel header="Delete your account" className={styles.use('mt-4')}>
          <Alert message="This action cannot be undone. This will permanently delete all your mailboxes, labels, threads and messages." type="warning" />
          <div className={styles.use('m-3')}>
            <Checkbox>I fully understand the consequences of deleting my account</Checkbox>
          </div>
          <Divider dashed />
          <Button type="danger">Delete Account</Button>
        </Panel>

      </Collapse>

      {/* <Divider dashed />

      <Row className={styles.use('mt-4')} gutter={48}>
        <Col span={8}>
          <Title level={4}>Your privacy matters</Title>
          <Paragraph>Mailyard goes to great lengths to ensure your privacy. All your data is encrypted in the browser before it is sent to our servers for storage. As an email backup service, we do not even know your email address as we rely on browser notifications for communication, nor do we collect emails during payment.</Paragraph>
          <Button type="link" href="#">Read more</Button>
        </Col>
        <Col span={8}>
          <Title level={4}>Security in depth</Title>
          <Paragraph>
            Mailyard secures your data using encryption keys&nbsp;(
            <abbr title="Data Encryption Key">DEK</abbr>
            &nbsp;and&nbsp;
            <abbr title="Key Encryption Key">KEK</abbr>
            )&nbsp;that we store on our servers, but are unlocked only within the client using your chosen passphrase. With the Lanyard browser extension, you can store your keys securely without entrusting them to our servers.
          </Paragraph>
          <Button type="link" href="#">Read more</Button>
        </Col>
        <Col span={8}>
          <Title level={4}>Your data is safe with us</Title>
          <Paragraph>
            Your emails are stored across multiple availability zones on Amazon S3 to avoid data loss, but still adhere to regulatory requirements such as&nbsp;
            <abbr title="General Data Protection Regulation">GDPR</abbr>
            . You can request for your all data at any time, and account deletion requests will be honored to the fullest extent possible.
          </Paragraph>
          <Button type="link" href="#">Read more</Button>
        </Col>
      </Row> */}

    </React.Fragment>
  );
};

export default Account;
