"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const index_1 = __importDefault(require("../src/index"));
chai_1.default.use(chai_http_1.default);
const expect = chai_1.default.expect;
describe('Contact Message API', () => {
    it('should return an array of messages', (done) => {
        chai_1.default.request(index_1.default)
            .get('/contact/message')
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
        });
    });
});
