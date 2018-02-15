/* eslint-disable no-param-reassign */
const digest = require('./digest');
const jsonDB = require('./jsonDb');

const loadFixture = (cassettePath, axiosConfig) => {
  const requestKey = digest(axiosConfig);
  return jsonDB.loadAt(cassettePath, requestKey);
};

exports.success = cassettePath =>
  axiosConfig =>
    loadFixture(cassettePath, axiosConfig)
      .then((cassette) => {
        axiosConfig.adapter = () => {
          cassette.originalResponseData.fixture = true;
          if (cassette.originalResponseData.status >= 400) {
            return Promise.reject(cassette.originalResponseData);
          }
          return new Promise(resolve => resolve(cassette.originalResponseData));
        };
        return axiosConfig;
      }).catch(() => axiosConfig);

exports.failure = error => Promise.reject(error);

