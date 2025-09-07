import {CameraTwoTone, CarTwoTone, RocketTwoTone} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="Powered by ours"
      links={[
        {
          key: 'github',
          title: <><CameraTwoTone/> miemingdouwu</>,
          href: 'https://github.com/miemingdouwu',
          blankTarget: true,
        },
        {
          key: 'Yxin',
          title: <><CarTwoTone/> YxinMiracle</>,
          href: 'https://github.com/YxinMiracle',
          blankTarget: true,
        },
        {
          key: "HC-Zhou",
          title: <><RocketTwoTone/> HC-Zhou </>,
          href: 'https://github.com/HC-Zhou',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
