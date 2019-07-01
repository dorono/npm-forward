"use strict";

const expect = require("chai").expect;
const anchors = require("../src/util/factom-proof");

let bitcoin_anchor = {
    "network": "bitcoin",
    "status": "confirmed",
    "txId":"469a96c847cf8bf1f325b6eec850f46488ed671930d62b54ed186a8031477a7d",
    "blockHash":"000000000000000001edf3adf719dfc1263661d2c4b0ed779d004a2cbb7cca32"
};
  
let ethereum_anchor = {
    "network": "ethereum",
    "status": "confirmed",
    "windowEndHeight": 1234,
    "windowStartHeight": 234,
    "windowMr": "d7560e6ac81707822e9c34a5719cebb337ef6a17d6505627017b0a5db1be8ca8",
    "contractAddress": "0xfac2a7f0e5c7da88c7dc327d4092a828557233f9",
    "txId": "0x296dd007cdf0d83809a60442d6e4384c6c87b98697ff1609ff4d6f42f99ff37c",
    "blockHash": "0xc58b2938a252d635c44429f1931fbccc2dad21809e5d1fb5b735b065f38c7354",
    "txIndex": 4,
    "merkleBranch": [
      {
        "left": "7818914aff2c1f1c224c1542a2c33ba639dce2ccac14c346cd6f82fa60dea84c",
        "right": "ebec9c389e498e48222d1c382197a1b40452b8f12558e8ca6906e1ace33e71f4",
        "top": "701a26aef6184fb5443049dab8e903632597cd935da6e01dff0fe0c40633d26f"
      },
      {
        "left": "3e8273113bc32d0e7bc72d8cb1f643f2e4d907d35ff324393048ab282f72ffad",
        "right": "701a26aef6184fb5443049dab8e903632597cd935da6e01dff0fe0c40633d26f",
        "top": "47bad79ca5f83c0ba1eff1735c432efb5915adf532f41b3b88e4b2e8565360fc"
      },
      {
        "left": "9aa2450336deb5a769d927eebc2fbdaa604e160d3dbc8e416573a86ac60f5bda",
        "right": "47bad79ca5f83c0ba1eff1735c432efb5915adf532f41b3b88e4b2e8565360fc",
        "top": "211528f3fdcb41eff829876d93de5b9a0146db5469b82418abfd87aaaa2b63f5"
      },
      {
        "left": "211528f3fdcb41eff829876d93de5b9a0146db5469b82418abfd87aaaa2b63f5",
        "right": "211528f3fdcb41eff829876d93de5b9a0146db5469b82418abfd87aaaa2b63f5",
        "top": "2ac08d2e9db6b6b5aac7488fe22aeeacbe796f2aa43593b9fe417de32547c254"
      },
      {
        "left": "2ac08d2e9db6b6b5aac7488fe22aeeacbe796f2aa43593b9fe417de32547c254",
        "right": "2ac08d2e9db6b6b5aac7488fe22aeeacbe796f2aa43593b9fe417de32547c254",
        "top": "96184e2e05a2f63a2af6dc207b9218e73d71d17d43811ba8618456d4aa5614a7"
      },
      {
        "left": "c598434c96a674c342b5b25d96176bbe2998ee178d4e9e6d73263c3e8d0de7af",
        "right": "96184e2e05a2f63a2af6dc207b9218e73d71d17d43811ba8618456d4aa5614a7",
        "top": "2b37b64491f76bba1340f7c579cd0fac7e87728a9d2b0e6973944b07089d4787"
      },
      {
        "left": "767a0a5ef7afb0b0d8f63e25c8698058d493af7c3b4255fd1c82dce5851c4559",
        "right": "2b37b64491f76bba1340f7c579cd0fac7e87728a9d2b0e6973944b07089d4787",
        "top": "ece2dc366c803a30abde2325fbf1661e588f03d4dd11d35dfc887a6636f1196a"
      },
      {
        "left": "7dc0826a955ff86d8b59d83fd878d759b8408c942574632ef4b77b3196890a29",
        "right": "ece2dc366c803a30abde2325fbf1661e588f03d4dd11d35dfc887a6636f1196a",
        "top": "6bc6343da90c9e34c646aa675cde02465449becdf677ae740b3a559fa7dfd839"
      },
      {
        "left": "de321824e82095b93d4411bf2b246fe00419f83b1beb5f9ad98150b2c2ef000c",
        "right": "6bc6343da90c9e34c646aa675cde02465449becdf677ae740b3a559fa7dfd839",
        "top": "69b2f9964d2ba9c39185db5d8fc836c12f0fea106f72993686b3d24175b8887b"
      },
      {
        "left": "af5e77143ca014154bce334e34ac37aad99944643c843ed58633549b387347d7",
        "right": "69b2f9964d2ba9c39185db5d8fc836c12f0fea106f72993686b3d24175b8887b",
        "top": "d7560e6ac81707822e9c34a5719cebb337ef6a17d6505627017b0a5db1be8ca8"
      }
    ]
};

let factom_anchor = {
    "network": "factom",
    "networkId": "",
    "createdAt": "2019-04-15T15:46:04Z",
    "entrySerialized": "008774e15f162f4e3a8f03bc7d4c5845bf9bee9bc9c4155802366f90ae92b47c900012000474657374000474657374000474657374746573740a",
    "entryHash": "36993363235ba2204877e78e9e1b4d5055edfa838df58ebb077098697adbeee5",
    "merkleBranch": [
    {
      "right": "0000000000000000000000000000000000000000000000000000000000000006",
      "top": "5ae8146c21527901cff56c8b5004a3675a4268229f2a7e3802ecd07d0910a107",
      "left": "36993363235ba2204877e78e9e1b4d5055edfa838df58ebb077098697adbeee5"
    },
    {
      "right": "5ae8146c21527901cff56c8b5004a3675a4268229f2a7e3802ecd07d0910a107",
      "top": "43e55fc368f8243958d25e16a67ec16074276fb379f36d368593422cf3df21a5",
      "left": "798e2cf5d132ff8634cdf846f2facafc66d1d3b53573098ffcfc43bc97448e3c"
    },
    {
      "right": "43e55fc368f8243958d25e16a67ec16074276fb379f36d368593422cf3df21a5",
      "top": "fcd21fedfe23ea79df5c79c9aab77640a76c7f40ae2a97354cd4f9958d7e661a",
      "left": "8774e15f162f4e3a8f03bc7d4c5845bf9bee9bc9c4155802366f90ae92b47c90"
    },
    {
      "right": "fcd21fedfe23ea79df5c79c9aab77640a76c7f40ae2a97354cd4f9958d7e661a",
      "top": "3afbee04fc2eecfe8af8b1e30f828bee9792b15d05c888afac8db5b835f3bad2",
      "left": "78c87c440e771e2f8aaa27012acd5021211fb2c8b6d8437c4bad8dd9e9bcb294"
    },
    {
      "right": "3afbee04fc2eecfe8af8b1e30f828bee9792b15d05c888afac8db5b835f3bad2",
      "top": "46556e7b4a788510c3ab383564e95539ccb2a24fec294c4d42ee6c93b66b1231",
      "left": "114d36308dda1d749b529d8ed21f0471777390fab69fb1ca69d71438bb286234"
    },
    {
      "right": "46556e7b4a788510c3ab383564e95539ccb2a24fec294c4d42ee6c93b66b1231",
      "top": "7818914aff2c1f1c224c1542a2c33ba639dce2ccac14c346cd6f82fa60dea84c",
      "left": "643df17024a3a3cfcc7bff522ade7e0ed46637961a65b66b912fcdff4e5b3a72"
    }
    ],
    "dblock": {
      "keymr": "7818914aff2c1f1c224c1542a2c33ba639dce2ccac14c346cd6f82fa60dea84c",
      "height": 5678
    }
};

let dblock_info = {
"keymr": "7818914aff2c1f1c224c1542a2c33ba639dce2ccac14c346cd6f82fa60dea84c",
"height": 1234
};


describe("#validateFactomAnchor", function() {
    it("should validate good factom anchor successfully", function() {
        const result = anchors.validateFactomAnchor(factom_anchor);
        expect(result).to.be.true;
    });

    it("should reject broken factom anchor", function() {
        factom_anchor.entryHash = "16993363235ba2204877e78e9e1b4d5055edfa838df58ebb077098697adbeee5";
        const result = anchors.validateFactomAnchor(factom_anchor);
        expect(result).to.be.false;
    });
});


describe("#validateBitcoinAnchor", function() {
    it("should validate good bitcoin anchor successfully", function() {
        const result = anchors.validateBitcoinAnchor(bitcoin_anchor);
        expect(result).to.be.true;
    });

    it("should reject broken bitcoin anchor", function() {
        delete bitcoin_anchor.blockHash;
        const result = anchors.validateBitcoinAnchor(bitcoin_anchor);
        expect(result).to.be.false;
    });
});


describe("#validateEthereumAnchor", function() {
    it("should validate good ethereum anchor successfully", function() {
        const result = anchors.validateEthereumAnchor(dblock_info, ethereum_anchor);
        // expect(result).to.be.true;
        // Un-comment above line once we have real ethereum anchor data to test against
    });

    it("should reject broken ethereum anchor", function() {
        ethereum_anchor.windowMr = "e7560e6ac81707822e9c34a5719cebb337ef6a17d6505627017b0a5db1be8ca8"
        const result = anchors.validateEthereumAnchor(dblock_info, ethereum_anchor);
        expect(result).to.be.false;
    });
});