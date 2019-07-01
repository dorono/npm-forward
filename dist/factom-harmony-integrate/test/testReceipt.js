"use strict";

const expect = require("chai").expect;
const receipts = require("../src/util/factom-proof");

let receiptObject = {
    "data": {
      "dblock": {
        "keymr": "9423f275c4bfe567ff74cefdee646cb2ac639af0a32fb7ba43265d30a86b412e",
        "href": "/v1/dblocks/9423f275c4bfe567ff74cefdee646cb2ac639af0a32fb7ba43265d30a86b412e",
        "height": 14396
      },
      "createdAt": "2019-05-16T18:04:00",
      "chain": {
        "chainId": "b69617ddea0cae1d9035f6add50441b5605d44f13f6abb055e7597da05b46bfc",
        "href": "/v1/chains/b69617ddea0cae1d9035f6add50441b5605d44f13f6abb055e7597da05b46bfc"
      },
      "merkleBranch": [
        {
          "top": "62bd76fd89025a34e2c438e5f18e958a51796533aacbb742fca683085914b7f6",
          "right": "4f4f307530e43f45cb9a7fbecbeee67ade7a21ea006b6846e9c0ea6fca776f6b",
          "left": "8d25b8300ba3a8390c66dd9e3544c4d52676efcf0d71019221d9fb6563689192"
        },
        {
          "top": "0afcde787426968196e5f921e88e79e14cb7adbbccfee6b43f49d791c7ba3a50",
          "right": "604945121c70550cb399ea6677976cad59a0a7dde7dd86e4718235ae54e51e90",
          "left": "62bd76fd89025a34e2c438e5f18e958a51796533aacbb742fca683085914b7f6"
        },
        {
          "top": "58b94955f2675106f3930d696408cc95a9ed11f72978bc31b473411babffab69",
          "right": "5cc3ef6c1abf1cf0ef982e917291f6118c178589106f1ae710f05143eda46c26",
          "left": "0afcde787426968196e5f921e88e79e14cb7adbbccfee6b43f49d791c7ba3a50"
        },
        {
          "top": "dd74eac949e29e3af309ef4c4bcc672ceb374f56ad2eb56ae3d4090cee5c5685",
          "right": "58b94955f2675106f3930d696408cc95a9ed11f72978bc31b473411babffab69",
          "left": "9057ee72dd5e546f7767356e1637630f4528d23a3efd3ca5aab075fe2eaa4232"
        },
        {
          "top": "642d5041b3abe22142ad7c060f24e6d10e4fd11aac48640eedd6db9fd358b9a8",
          "right": "dd74eac949e29e3af309ef4c4bcc672ceb374f56ad2eb56ae3d4090cee5c5685",
          "left": "b69617ddea0cae1d9035f6add50441b5605d44f13f6abb055e7597da05b46bfc"
        },
        {
          "top": "56c50a9340681fb36635a6c34ee16dc053931f24f4c203d0541d41a29ba83457",
          "right": "91a06cc98d23379cfd9b4301ccdfc05e06196b200d4e0ce9615bf939529eac9e",
          "left": "642d5041b3abe22142ad7c060f24e6d10e4fd11aac48640eedd6db9fd358b9a8"
        },
        {
          "top": "fc210b5a940ce26acae99d3a9a044aae99f36a85684236c8e7444f76525ab5f0",
          "right": "56c50a9340681fb36635a6c34ee16dc053931f24f4c203d0541d41a29ba83457",
          "left": "a464cd4000a62fdfce2d7cd831b60bd1915788cbc62a64f10a9b7c6eaebbf649"
        },
        {
          "top": "baff07c95d51703a7931f0adb55f13f68e59395f76f5e0604c60d6beaa448b9f",
          "right": "fc210b5a940ce26acae99d3a9a044aae99f36a85684236c8e7444f76525ab5f0",
          "left": "ce8fd87cfcc60153348514d5e2e1328be4df0f220f5493a3e8bf4c0fcf6b6b69"
        },
        {
          "top": "1627d51ac16856f5252d77efa2331a94822cd7376f4a39b7984b2aee57b31f8b",
          "right": "08159af23fd45075b7173c4afcd683199523a982997fb6037d1f7faa2b70436c",
          "left": "baff07c95d51703a7931f0adb55f13f68e59395f76f5e0604c60d6beaa448b9f"
        },
        {
          "top": "2a5524e03b07391375f8214d1085258b8bb7d9976bf94c3122dee54d2574a018",
          "right": "a77e69d8ec2a171197aff6313880b292022ec724c8329c6477ec6e31abeab3ad",
          "left": "1627d51ac16856f5252d77efa2331a94822cd7376f4a39b7984b2aee57b31f8b"
        },
        {
          "top": "c55c51fca51d27ba8e5baa06d4717fb7b5cd7bc5df21ae4e59a49e03ba0cc9cf",
          "right": "925c2638f22f203878e13c351770aeec0a7aaad2b09a5dad65eea7a3bbfb08e8",
          "left": "2a5524e03b07391375f8214d1085258b8bb7d9976bf94c3122dee54d2574a018"
        },
        {
          "top": "6e197149ca2e1993e1163afb698ec91451b70cde455f72ef16f9423f5ce8ccda",
          "right": "c55c51fca51d27ba8e5baa06d4717fb7b5cd7bc5df21ae4e59a49e03ba0cc9cf",
          "left": "083a575545229d8d68ba4fc13ee4dd1d74fd6ee1fd6f00a9d1e3d987f8024415"
        },
        {
          "top": "9423f275c4bfe567ff74cefdee646cb2ac639af0a32fb7ba43265d30a86b412e",
          "right": "6e197149ca2e1993e1163afb698ec91451b70cde455f72ef16f9423f5ce8ccda",
          "left": "ba244540477bc3694d7181a5cfa412c9e3e00ce8716005888414312272ffdbe9"
        }
      ],
      "entryHash": "4f4f307530e43f45cb9a7fbecbeee67ade7a21ea006b6846e9c0ea6fca776f6b",
      "eblock": {
        "keymr": "dd74eac949e29e3af309ef4c4bcc672ceb374f56ad2eb56ae3d4090cee5c5685",
        "href": "/v1/eblocks/dd74eac949e29e3af309ef4c4bcc672ceb374f56ad2eb56ae3d4090cee5c5685"
      },
      "entrySerialized": "00b69617ddea0cae1d9035f6add50441b5605d44f13f6abb055e7597da05b46bfc0022000e637563756d6265725f373530333800104d6163446f7567616c6c5f38373836346578756c746174696f6e5f3833333231"
    }
  }
  
  let badReceiptObject = {
    "data": {
      "dblock": {
        "keymr": "9423f275c4bfe567ff74cefdee646cb2ac639af0a32fb7ba43265d30a86b412e",
        "href": "/v1/dblocks/9423f275c4bfe567ff74cefdee646cb2ac639af0a32fb7ba43265d30a86b412e",
        "height": 14396
      },
      "createdAt": "2019-05-16T18:04:00",
      "chain": {
        "chainId": "b69617ddea0cae1d9035f6add50441b5605d44f13f6abb055e7597da05b46bfc",
        "href": "/v1/chains/b69617ddea0cae1d9035f6add50441b5605d44f13f6abb055e7597da05b46bfc"
      },
      "merkleBranch": [
        {
          "top": "62bd76fd89025a34e2c438e5f18e958a51796533aacbb742fca683085914b7f6",
          "right": "b69617ddea0cae1d9035f6add50441b5605d44f13f6abb055e7597da05b46bfc",
          "left": "8d25b8300ba3a8390c66dd9e3544c4d52676efcf0d71019221d9fb6563689192"
        },
        {
          "top": "0afcde787426968196e5f921e88e79e14cb7adbbccfee6b43f49d791c7ba3a50",
          "right": "604945121c70550cb399ea6677976cad59a0a7dde7dd86e4718235ae54e51e90",
          "left": "62bd76fd89025a34e2c438e5f18e958a51796533aacbb742fca683085914b7f6"
        },
        {
          "top": "58b94955f2675106f3930d696408cc95a9ed11f72978bc31b473411babffab69",
          "right": "5cc3ef6c1abf1cf0ef982e917291f6118c178589106f1ae710f05143eda46c26",
          "left": "0afcde787426968196e5f921e88e79e14cb7adbbccfee6b43f49d791c7ba3a50"
        },
        {
          "top": "dd74eac949e29e3af309ef4c4bcc672ceb374f56ad2eb56ae3d4090cee5c5685",
          "right": "58b94955f2675106f3930d696408cc95a9ed11f72978bc31b473411babffab69",
          "left": "9057ee72dd5e546f7767356e1637630f4528d23a3efd3ca5aab075fe2eaa4232"
        },
        {
          "top": "642d5041b3abe22142ad7c060f24e6d10e4fd11aac48640eedd6db9fd358b9a8",
          "right": "dd74eac949e29e3af309ef4c4bcc672ceb374f56ad2eb56ae3d4090cee5c5685",
          "left": "b69617ddea0cae1d9035f6add50441b5605d44f13f6abb055e7597da05b46bfc"
        },
        {
          "top": "56c50a9340681fb36635a6c34ee16dc053931f24f4c203d0541d41a29ba83457",
          "right": "91a06cc98d23379cfd9b4301ccdfc05e06196b200d4e0ce9615bf939529eac9e",
          "left": "642d5041b3abe22142ad7c060f24e6d10e4fd11aac48640eedd6db9fd358b9a8"
        },
        {
          "top": "fc210b5a940ce26acae99d3a9a044aae99f36a85684236c8e7444f76525ab5f0",
          "right": "56c50a9340681fb36635a6c34ee16dc053931f24f4c203d0541d41a29ba83457",
          "left": "a464cd4000a62fdfce2d7cd831b60bd1915788cbc62a64f10a9b7c6eaebbf649"
        },
        {
          "top": "baff07c95d51703a7931f0adb55f13f68e59395f76f5e0604c60d6beaa448b9f",
          "right": "fc210b5a940ce26acae99d3a9a044aae99f36a85684236c8e7444f76525ab5f0",
          "left": "ce8fd87cfcc60153348514d5e2e1328be4df0f220f5493a3e8bf4c0fcf6b6b69"
        },
        {
          "top": "1627d51ac16856f5252d77efa2331a94822cd7376f4a39b7984b2aee57b31f8b",
          "right": "08159af23fd45075b7173c4afcd683199523a982997fb6037d1f7faa2b70436c",
          "left": "baff07c95d51703a7931f0adb55f13f68e59395f76f5e0604c60d6beaa448b9f"
        },
        {
          "top": "2a5524e03b07391375f8214d1085258b8bb7d9976bf94c3122dee54d2574a018",
          "right": "a77e69d8ec2a171197aff6313880b292022ec724c8329c6477ec6e31abeab3ad",
          "left": "1627d51ac16856f5252d77efa2331a94822cd7376f4a39b7984b2aee57b31f8b"
        },
        {
          "top": "c55c51fca51d27ba8e5baa06d4717fb7b5cd7bc5df21ae4e59a49e03ba0cc9cf",
          "right": "925c2638f22f203878e13c351770aeec0a7aaad2b09a5dad65eea7a3bbfb08e8",
          "left": "2a5524e03b07391375f8214d1085258b8bb7d9976bf94c3122dee54d2574a018"
        },
        {
          "top": "6e197149ca2e1993e1163afb698ec91451b70cde455f72ef16f9423f5ce8ccda",
          "right": "c55c51fca51d27ba8e5baa06d4717fb7b5cd7bc5df21ae4e59a49e03ba0cc9cf",
          "left": "083a575545229d8d68ba4fc13ee4dd1d74fd6ee1fd6f00a9d1e3d987f8024415"
        },
        {
          "top": "9423f275c4bfe567ff74cefdee646cb2ac639af0a32fb7ba43265d30a86b412e",
          "right": "6e197149ca2e1993e1163afb698ec91451b70cde455f72ef16f9423f5ce8ccda",
          "left": "ba244540477bc3694d7181a5cfa412c9e3e00ce8716005888414312272ffdbe9"
        }
      ],
      "entryHash": "4f4f307530e43f45cb9a7fbecbeee67ade7a21ea006b6846e9c0ea6fca776f6b",
      "eblock": {
        "keymr": "dd74eac949e29e3af309ef4c4bcc672ceb374f56ad2eb56ae3d4090cee5c5685",
        "href": "/v1/eblocks/dd74eac949e29e3af309ef4c4bcc672ceb374f56ad2eb56ae3d4090cee5c5685"
      },
      "entrySerialized": "00b69617ddea0cae1d9035f6add50441b5605d44f13f6abb055e7597da05b46bfc0022000e637563756d6265725f373530333800104d6163446f7567616c6c5f38373836346578756c746174696f6e5f3833333231"
    }
  }
  

describe("#checkReceipts", function() {
    it("should accept a valid receipt", function() {
        const receipt_check = receipts.validateReceipt(receiptObject.data);
        expect(receipt_check).to.be.true;
    });

    it("should reject an invalid receipt (entryHash not included)", function() {
        const receipt_check = receipts.validateReceipt(badReceiptObject.data);
        expect(receipt_check).to.be.false;
    });
});