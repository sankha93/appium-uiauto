// transpile:mocha

import { instrumentsInstanceInit, globalInit, killAll } from './base';
import path from'path';
import rimraf from 'rimraf';

describe('config', function () {
  describe('custom socket', () => {
    let altSockDir = '/tmp/abcd';
    let altSock = path.resolve(altSockDir, 'sock');

    let ctx;
    before(async function () {
      rimraf.sync(altSockDir);
      await globalInit(this, { chai: true, sock: altSock });
      ctx = await instrumentsInstanceInit({ sock: altSock });
    });
    after(async () => {
      await killAll(ctx);
    });

    it('should use the alternate sock', function () {
      ctx.proxy.should.exist;
      ctx.proxy.getSock().should.equal(altSock);
    });

    it('should work', async () => {
      let res = await ctx.execFunc(
        function () {
          return 'OK Boss';
        }
      );
      res.should.equal('OK Boss');
    });

  });

});