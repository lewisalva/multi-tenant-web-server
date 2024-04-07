import { treaty } from '@elysiajs/eden';
import { describe, expect, it } from 'bun:test';

import { authRouter } from '../../../src/api/auth/auth.router';

const authApi = treaty(authRouter);

describe('auth.router', () => {
  it('should be defined', () => {
    expect(authRouter).toBeDefined();
  });

  describe('signin.post', () => {
    it('throws invalid email', async () => {
      const { status, error } = await authApi.auth.signin.post({ email: '', password: '' });

      expect(status).toEqual(422);
      // @ts-expect-error Elysia does not return validation error types
      expect(error?.value).toEqual('Invalid email');
    });

    it('throws invalid password', async () => {
      const { status, error } = await authApi.auth.signin.post({
        email: 'a@b.test',
        password: '',
      });

      expect(status).toEqual(422);
      // @ts-expect-error Elysia does not return validation error types
      expect(error?.value).toEqual('Invalid password');
    });

    it('returns 404', async () => {
      const { status, error } = await authApi.auth.signin.post({
        email: 'a@b.test',
        password: 'password',
      });

      expect(status).toEqual(404);
      expect(error?.value).toEqual('Not Found');
    });

    it('returns 204 w/ cookie', async () => {
      const { status, headers } = await authApi.auth.signin.post({
        email: 'lewis@j1.support',
        password: '123456',
      });

      const cookie = (headers as Headers).getSetCookie();

      expect(status).toEqual(204);
      expect(cookie).toHaveLength(1);
    });
  });

  describe('signout.post', () => {
    it('throws not logged in', async () => {
      const { status, error } = await authApi.auth.signout.post();

      expect(status).toEqual(401);
      expect(error?.value).toEqual('Unauthorized');
    });

    it('returns 204 w/ cookie deletion; for valid login', async () => {
      const { headers: authHeaders } = await authApi.auth.signin.post({
        email: 'lewis@j1.support',
        password: '123456',
      });

      const [cookie] = (authHeaders as Headers).getSetCookie();

      const { status, headers } = await authApi.auth.signout.post(null, { headers: { cookie } });

      const deletedCookie = (headers as Headers).getSetCookie();

      expect(status).toEqual(204);
      expect(deletedCookie).toHaveLength(0);
    });
  });

  describe('signup.post', () => {
    it('throws invalid email', async () => {
      const { status, error } = await authApi.auth.signup.post({
        email: '',
        password: '',
        name: '',
      });

      expect(status).toEqual(422);
      // @ts-expect-error Elysia does not return validation error types
      expect(error?.value).toEqual('Invalid email');
    });

    it('throws invalid password', async () => {
      const { status, error } = await authApi.auth.signup.post({
        email: 'a@b.test',
        password: '',
        name: '',
      });

      expect(status).toEqual(422);
      // @ts-expect-error Elysia does not return validation error types
      expect(error?.value).toEqual('Invalid password');
    });

    it('throws invalid name', async () => {
      const { status, error } = await authApi.auth.signup.post({
        email: 'a@b.test',
        password: 'password',
        name: '',
      });

      expect(status).toEqual(422);
      // @ts-expect-error Elysia does not return validation error types
      expect(error?.value).toEqual('Invalid name');
    });

    it('throws conflict', async () => {
      const { status, error } = await authApi.auth.signup.post({
        email: 'lewis@j1.support',
        password: 'password',
        name: 'a',
      });

      expect(status).toEqual(409);
      expect(error?.value).toEqual('Conflict');
    });

    it.todo('throws 500', () => {}); // not sure what will trigger this atm

    it('returns 204 w/ cookie', async () => {
      const { status, headers } = await authApi.auth.signup.post({
        email: 'lewis@j2.support',
        password: 'password',
        name: 'a',
      });

      const cookie = (headers as Headers).getSetCookie();

      expect(status).toEqual(201);
      expect(cookie).toHaveLength(1);
    });
  });
});
