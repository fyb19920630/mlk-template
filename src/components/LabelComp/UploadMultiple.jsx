import React, { Component } from 'react';
import { Upload, Icon, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Styles from './UploadMultiple.less';

const OSS = require('ali-oss');

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// 上传文件的路径，使用日期命名文件目录
const uploadPath = (self, file) =>
  `csClub/${moment().format('YYYYMMDD')}/${file.name.split('.')[0]}-${file.uid}.${
    file.type.split('/')[1]
  }`;

const UploadToOss = (self, file) => {
  const { OSSData } = self.state;
  const url = uploadPath(self, file);
  return new Promise((resolve, reject) => {
    new OSS(OSSData)
      .multipartUpload(url, file)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

class UploadMultiple extends Component {
  state = {
    OSSData: {},
    fileList: [],
    previewVisible: false,
    previewImage: '',
  };

  componentDidMount() {
    this.props.onRef(this); // 连接父子组件
    this.setOssData();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      fileList: nextProps.configInfo,
    });
  }

  setOssData = () => {
    let OSSData = {};
    if (process.env.API_ENV !== 'prod') {
      OSSData = {
        accessKeyId: 'LTAIr0gAe6RxOB5D',
        accessKeySecret: 'PxcgCp6plnkjq9iv5VRNClpxlpoqwi',
        region: 'oss-cn-beijing',
        bucket: 'meilike-test',
      };
    } else {
      OSSData = {
        accessKeyId: 'LTAI4Fp5i2YpkNQ38EJjePYA',
        accessKeySecret: 'NhvWI5vVcd6FyDJWW6DiV5bkkKHKXw',
        region: 'oss-cn-beijing',
        bucket: 'ddsp-click',
      };
    }
    this.setState({ OSSData });
  };

  uploadSubmit = () => {
    const { fileList } = this.state;
    const { uploadSuccess } = this.props;
    fileList.forEach(item => {
      if (item.originFileObj) {
        UploadToOss(this, item.originFileObj).then(data => {
          uploadSuccess(data.name);
        });
      } else {
        uploadSuccess(item.name);
      }
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  render() {
    const { maxPhoto, onChange } = this.props;
    const { fileList, OSSData, previewVisible, previewImage } = this.state;
    const props = {
      listType: 'picture-card',
      showUploadList: true,
      multiple: true,
      beforeUpload: () => false,
      onChange: info => {
        let fileL = [];
        if (maxPhoto && maxPhoto < info.fileList.length) {
          fileL = info.fileList.slice(0, maxPhoto);
        } else {
          fileL = info.fileList;
        }
        fileL.forEach(item => {
          if (item.originFileObj) {
            getBase64(item.originFileObj, imageUrl => {
              item.url = imageUrl;
            });
          }
        });
        this.setState({
          fileList: fileL,
        });
        if (onChange && typeof onChange === 'function') {
          onChange(fileL);
        }
      },
    };
    const uploadButton = (
      <div className={Styles.uploadBtn}>
        <Icon type="upload" />
        <div className={Styles.uploadText}>点击上传</div>
      </div>
    );
    return (
      <div className={Styles.uploadMultipleCon}>
        <Upload
          {...props}
          action={OSSData && OSSData.host ? OSSData.host : null}
          className={Styles.uploadMultiple}
          fileList={fileList}
          onPreview={this.handlePreview}
        >
          {maxPhoto && maxPhoto <= fileList.length ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  global,
}))(UploadMultiple);
