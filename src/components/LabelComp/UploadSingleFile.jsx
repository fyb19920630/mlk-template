import React, { Component } from 'react';
import { Upload, Icon, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Styles from './UploadSingleFile.less';

const OSS = require('ali-oss');

const client = self => {
  const { OSSData } = self.state;
  let bucket;
  if (process.env.API_ENV !== 'prod') {
    bucket = 'meilike-test';
  } else {
    bucket = 'meilike-test';
  }
  return new OSS({
    accessKeyId: OSSData.accessid,
    accessKeySecret: 'PxcgCp6plnkjq9iv5VRNClpxlpoqwi' || OSSData.accessKeySecret,
    region: 'oss-cn-beijing',
    bucket: bucket,
  });
};

const uploadPath = (self, path, file) => {
  const { OSSData } = self.state;
  // 上传文件的路径，使用日期命名文件目录
  return `${OSSData.dir}${moment().format('YYYYMMDD')}/${file.name.split('.')[0]}-${file.uid}.${
    file.type.split('/')[1]
  }`;
};
const UploadToOss = (self, path, file) => {
  const url = uploadPath(self, path, file);
  return new Promise((resolve, reject) => {
    client(self)
      .multipartUpload(url, file)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

class UploadSingleFile extends Component {
  state = {
    OSSData: {},
    fileList: [],
    file: {},
  };

  componentDidMount() {
    this.props.onRef(this); // 连接父子组件
    this.mockGetOSSData();
  }

  mockGetOSSData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/getOSSConfig',
      payload: {
        dir: 'DDSP/',
      },
      callback: res => {
        this.setState({
          OSSData: res,
        });
      },
    });
  };

  uploadSubmit = () => {
    const { file } = this.state;
    const { uploadSuccess, configInfo } = this.props;
    UploadToOss(this, '上传路径oss配置信息', file).then(data => {
      uploadSuccess(data.res.requestUrls[0], configInfo.index);
    });
  };

  render() {
    const { configInfo, choiceSuccess } = this.props;
    const { fileList, OSSData } = this.state;
    const props = {
      name: 'file',
      listType: 'file',
      showUploadList: true,
      beforeUpload: () => false,
      onChange: info => {
        let fileListArr = [...info.fileList];
        fileListArr = fileListArr.slice(-1);
        const l = fileListArr.length;
        if (l > 0) {
          this.setState({
            fileList: fileListArr,
            file: info.file,
          });
        } else {
          this.setState({
            fileList: fileListArr,
            file: '',
          });
        }
        if (choiceSuccess && typeof choiceSuccess === 'function') {
          choiceSuccess(info.file.uid, configInfo.index);
        }
      },
    };
    return (
      <div className={Styles.uploadSingleFileCon}>
        <Upload
          {...props}
          action={OSSData && OSSData.host ? OSSData.host : null}
          fileList={fileList}
        >
          <div className={Styles.uploadBtn}>
            <Icon type="upload" />
            <div>点击上传</div>
          </div>
        </Upload>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  global,
}))(UploadSingleFile);
