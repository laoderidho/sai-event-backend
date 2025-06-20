import { describe, it, expect } from 'bun:test';
import {
  generateRandomEmail,
  generateRandomName,
  generateRandomPassword,
  generateRandomPhoneNumber
} from './utils/general';

import { hostLink } from './config';

let tempEmail = ""
let tempPassword = ""
let temp_no_telp = ""
let temp_name = ""
let tempCongregation = 0 

describe("Auth Testing", () => {
  it("Register Success", async () => {
    const email = generateRandomEmail();
    const password = generateRandomPassword();
    const name = generateRandomName();
    const no_telp = generateRandomPhoneNumber();
    const congregation = 1;
    tempEmail = email
    temp_no_telp = no_telp
    tempCongregation = congregation
    tempPassword = password
    temp_name = name


    const res = await fetch(`${hostLink}auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
        no_telp,
        congregation_id: congregation,
      }),
    });

    // Tes response-nya
    expect(await res.status).toBe(201);
  });

  it("email Same", async()=>{
    const email = tempEmail;
    const password = tempPassword;
    const name = temp_name;
    const no_telp = temp_no_telp;
    const congregation = 1;

    const res = await fetch(`${hostLink}auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
        no_telp,
        congregation_id: congregation,
      }),
    });

    const dt = await res.json();

    const msg = dt.message;

    // Tes response-nya
    expect(await res.status).toBe(409);
    expect(await msg).toBe("Email Atau nomor Telepon sudah ada")
  })

  it("Not found Congregation", async () => {
    const email = generateRandomEmail();
    const password = generateRandomPassword();
    const name = generateRandomName();
    const no_telp = generateRandomPhoneNumber();


    const res = await fetch(`${hostLink}auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
        no_telp,
        congregation_id: 0,
      }),
    });

    const dt = await res.json();

    const msg = dt.message;

    // Tes response-nya
    expect(await res.status).toBe(404);
    expect(await msg).toBe("Jemaat Tidak ditemukan")
  });

  it("Login Success", async()=>{
    const email = tempEmail;
    const password = tempPassword;

    const res = await fetch(`${hostLink}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const dt = await res.json();
    const data = dt.data
    
    expect(await res.status).toBe(200)
    expect(await data.token).not.toBeNull()
    expect(await data.status).toBe("success")
  })

  it("Login failed email Not found", async () =>{
    const email = "testFaild@gmail.com";
    const password = tempPassword;

    const res = await fetch(`${hostLink}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const dt = await res.json();
    
    expect(await res.status).toBe(404)
    expect(await dt.message).toBe("Email dan Password salah")
  })

  it("Login Wrong Password", async () =>{
    const email = tempEmail;
    const password = "0";

    const res = await fetch(`${hostLink}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const dt = await res.json();
    
    expect(await res.status).toBe(404)
    expect(await dt.message).toBe("password salah")
  })
});
