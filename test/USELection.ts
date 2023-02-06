import { expect } from "chai";
import { ethers } from "hardhat";
import { USElection } from "../typechain-types/USElection";
describe("USElection", function () {
  let usElectionFactory;
  let usElection: USElection;
  before(async () => {
    usElectionFactory = await ethers.getContractFactory("USElection");
    usElection = await usElectionFactory.deploy();
    await usElection.deployed();
  });
  it("Should throw on trying to end election with not the owner", async function () {
    const [owner, addr1] = await ethers.getSigners();
    expect(usElection.connect(addr1).endElection()).to.be.revertedWith('Ownable: caller is not the owner');
    expect(await usElection.electionEnded()).to.equal(false); // Not Ended
  });
  it("Should return the current leader before submit any election results", async function () {
    expect(await usElection.currentLeader()).to.equal(0); // NOBODY
  });
  it("Should return the election status", async function () {
    expect(await usElection.electionEnded()).to.equal(false); // Not Ended
  });
  it("Should submit tied state results", async function () {
    const stateResults = {name: "Texas", votesBiden: 100, votesTrump: 100, stateSeats: 10};
    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith('There cannot be a tie');
  });
  it("Should submit 0 seats state results", async function () {
    const stateResults = {name: "Texas", votesBiden: 100, votesTrump: 100, stateSeats: 0};
    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith('States must have at least 1 seat');
  });
  it("Should submit state results and get current leader", async function () {
    const stateResults = {name: "California", votesBiden: 1000, votesTrump: 900, stateSeats: 32};
    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );
    await submitStateResultsTx.wait();
    expect(await usElection.currentLeader()).to.equal(1); // BIDEN
  });
  it("Should throw when try to submit already submitted state results", async function () {
    const stateResults = {name: "California", votesBiden: 1000, votesTrump: 900, stateSeats: 32};
    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "This state result was already submitted!"
    );
  });
  it("Should submit state results and get current leader", async function () {
    const stateResults = {name: "Ohaio", votesBiden: 800, votesTrump: 1200, stateSeats: 33};
    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );
    await submitStateResultsTx.wait();
    expect(await usElection.currentLeader()).to.equal(2); // TRUMP
  });
  it("Should end the elections, get the leader and election status", async function () {
    const endElectionTx = await usElection.endElection();
    await endElectionTx.wait();
    expect(await usElection.currentLeader()).to.equal(2); // TRUMP
    expect(await usElection.electionEnded()).to.equal(true); // Ended
  });
  it("Should get electionEnded", async function () {
    expect(await usElection.electionEnded()).to.be.equal(true);
  });
  it("Should try submit state results on ended election", async function () {
    const stateResults = {name: "Ohaio", votesBiden: 800, votesTrump: 1200, stateSeats: 33};
    expect(usElection.submitStateResult(stateResults)).to.be.revertedWith('The election has ended already');
  });

  describe("USElection-Biden", function () {
    before(async () => {
      usElectionFactory = await ethers.getContractFactory("USElection");
      usElection = await usElectionFactory.deploy();
      await usElection.deployed();
    });
    it("Should submit state results and get current leader", async function () {
      const stateResults = {name: "Ohaio", votesBiden: 1800, votesTrump: 1200, stateSeats: 33};
      const submitStateResultsTx = await usElection.submitStateResult(
        stateResults
      );
      await submitStateResultsTx.wait();
      expect(await usElection.currentLeader()).to.equal(1); // BIDEN
    });
    it("Should end the elections, get the leader and election status", async function () {
      const endElectionTx = await usElection.endElection();
      await endElectionTx.wait();
      expect(await usElection.currentLeader()).to.equal(1); // TRUMP
      expect(await usElection.electionEnded()).to.equal(true); // Ended
    });
  });

  describe("USElection-Mappings", function () {
    before(async () => {
      usElectionFactory = await ethers.getContractFactory("USElection");
      usElection = await usElectionFactory.deploy();
      await usElection.deployed();
    });
    it("Should submit state results and get seats and results submitted", async function () {
      const stateResults = {name: "Ohaio", votesBiden: 1800, votesTrump: 1200, stateSeats: 33};
      const submitStateResultsTx = await usElection.submitStateResult(
        stateResults
      );
      await submitStateResultsTx.wait();
      expect(await usElection.seats(1)).to.be.equal(33);
      expect(await usElection.resultsSubmitted("Ohaio")).to.be.equal(true);
    });
  });
});

