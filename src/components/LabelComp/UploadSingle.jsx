import React, { Component } from 'react';
import { Upload, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Styles from './UploadSingle.less';

const OSS = require('ali-oss');

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// 上传文件的路径，使用日期命名文件目录
const uploadPath = (self, file) =>
  `DDSP/${moment().format('YYYYMMDD')}/${file.name.split('.')[0]}-${file.uid}.${
    file.type.split('/')[1]
  }`;

const UploadToOss = (self, file) => {
  const { OSSData } = self.state;
  console.log('self, file', self, file);
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

class UploadSingle extends Component {
  state = {
    OSSData: {},
    fileList: [],
    file: {},
    imageUrl: '',
  };

  componentDidMount() {
    this.props.onRef(this); // 连接父子组件
    this.setOssData();
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
    const { file } = this.state;
    const { uploadSuccess, configInfo } = this.props;
    if (configInfo.imgUrl) {
      this.setState({ imageUrl: configInfo.imgUrl });
      uploadSuccess(configInfo.imgUrl, configInfo.index);
    } else {
      UploadToOss(this, file).then(data => {
        this.setState({ imageUrl: data.res.requestUrls[0].split('?')[0] });
        uploadSuccess(data.name, configInfo.index);
      });
    }
  };

  render() {
    const { configInfo, choiceSuccess, picHttp } = this.props;
    const { fileList, OSSData } = this.state;
    const props = {
      name: 'avatar',
      listType: 'picture-card',
      showUploadList: false,
      beforeUpload: () => false,
      onChange: info => {
        getBase64(info.file, imageUrl => {
          this.setState({
            imageUrl,
          });
        });
        const l = info.fileList.length;
        if (l > 0) {
          this.setState({
            fileList: [info.file],
            file: info.file,
          });
        } else {
          this.setState({
            fileList: [],
            file: '',
          });
        }
        if (choiceSuccess && typeof choiceSuccess === 'function') {
          choiceSuccess(info.file.uid, configInfo.index);
        }
      },
    };
    const uploadButton = (
      <div className={Styles.uploadBtn}>
        <Icon type="upload" />
        <div className={Styles.uploadText}>点击上传</div>
      </div>
    );
    const imgShow = () => {
      let showHtml = '';
      if (configInfo.imgUrl) {
        showHtml = <img src={picHttp + configInfo.imgUrl} alt="pic" className={Styles.photo} />;
      } else if (fileList.length === 1) {
        showHtml = <img src={this.state.imageUrl} alt="pic" className={Styles.photo} />;
      } else {
        showHtml = uploadButton;
      }
      return showHtml;
    };
    return (
      <div className={Styles.uploadSingleCon}>
        <span className={Styles.photoName}>{configInfo.titleName}</span>
        <Upload
          {...props}
          action={OSSData && OSSData.host ? OSSData.host : null}
          className={Styles.singlePhotoUpload}
          fileList={fileList}
        >
          {imgShow()}
        </Upload>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  global,
}))(UploadSingle);
