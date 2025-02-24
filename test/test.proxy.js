const { expect } = require("chai");
const { upgrades } = require("hardhat");
const { ethers } = require("ethers");

describe("SecureLedger Upgradeable Contract", function () {
  let secureLedger;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1 ] = await ethers.getSigners();
    const SecureLedger = await ethers.getContractFactory("SecureLedger");
    // Deploy the contract behind a proxy
    secureLedger = await upgrades.deployProxy(SecureLedger, [owner.address], { initializer: "initialize" });
    await secureLedger.waitForDeployment();
  });

  it("should initialize with the correct owner", async function () {
    expect(await secureLedger.owner()).to.equal(owner.address);
  });

  it("should allow data upload and emit DataUploaded", async function () {
    const dataName = "TestData";
    const content = "Hello, world!";
    const commit = "Initial commit";

    await expect(secureLedger.uploadData(dataName, content, commit))
      .to.emit(secureLedger, "DataUploaded")
      .withArgs(owner.address, dataName);

    // Check data integrity returns a 'match' message when contents are unchanged.
    const [message, details] = await secureLedger.checkDataIntegrity(owner.address, dataName, content);
    expect(message).to.contain("matches");
    // Verify the hash is computed correctly.
    expect(details.Hash).to.equal(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(content)));

    // Check that the upload history contains the document.
    const history = await secureLedger.getHistory();
    expect(history.length).to.equal(1);
    expect(history[0].dataName).to.equal(dataName);
  });

  it("should revert if uploading data with the same name twice", async function () {
    const dataName = "TestData";
    const content = "Hello, world!";
    const commit = "Initial commit";

    await secureLedger.uploadData(dataName, content, commit);
    await expect(secureLedger.uploadData(dataName, content, commit))
      .to.be.revertedWith("You already have a data uploaded with this name ");
  });

  it("should update data and emit DataUpdated", async function () {
    const dataName = "TestData";
    const content = "Hello, world!";
    const commit = "Initial commit";

    // Upload initial data
    await secureLedger.uploadData(dataName, content, commit);

    // Update data with new content and commit.
    const newContent = "Hello, blockchain!";
    const newCommit = "Update commit";
    await expect(secureLedger.updateData(dataName, newContent, newCommit))
      .to.emit(secureLedger, "DataUpdated")
      .withArgs(owner.address, dataName, newCommit);

    // Verify that checkDataIntegrity returns a "doesn't match" message when comparing old content.
    const [message, details] = await secureLedger.checkDataIntegrity(owner.address, dataName, content);
    expect(message).to.contain("doesn't match");
  });

  it("should revert updateData when no data exists for that name", async function () {
    const dataName = "NonExistentData";
    const newContent = "Hello";
    const newCommit = "Trying update";
    await expect(secureLedger.updateData(dataName, newContent, newCommit))
      .to.be.revertedWith("You don't have a registred data with this name !!");
  });
});
