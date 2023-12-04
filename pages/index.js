import axios from "axios";
import Head from "next/head";

import { useState } from "react";

function validateInputAddresses(address) {
  return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
}

export default () => {
  const [addressList, setAddressList] = useState();

  const [result, setResult] = useState({
    response: [],
  });
  const ChangeAddressList = (event) => {
    setAddressList(event.target.value);
  };

  console.log(result.response);

  const doCheck = async () => {
    setResult((previousInputs) => ({
      ...previousInputs,
      response: [],
    }));
    try {
      let address = addressList.split("\n");
      if (address.length > 0) {
        for (let i = 0; i < address.length; i++) {
          if (validateInputAddresses(address[i])) {
            try {
              let data = await axios.get(`/api/address?eoa=${address[i]}`);
              let result = data.data.data;
              if (data.data.status === 200) {
                setResult((previousInputs) => ({
                  ...previousInputs,
                  response: [
                    ...previousInputs.response,
                    {
                      address: result.address,
                      status: "Eligible",
                      count: result.contract_count,
                    },
                  ],
                }));
              } else {
                setResult((previousInputs) => ({
                  ...previousInputs,
                  response: [
                    ...previousInputs.response,
                    {
                      address: address[i],
                      status: "Not Eligible",
                      count: 0,
                    },
                  ],
                }));
              }
            } catch (err) {}
          }
        }
      }
    } catch (err) {}
  };

  const tableItems = result.response;
  return (
    <>
      <Head>
        <title>Mass Early Ethereum Adopters Checker | DMH</title>
        <meta property="og:image" content="/checker.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-20 gap-12 text-gray-600 md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl text-gray-800 font-extrabold mx-auto md:text-5xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]">
                Ethereum Early Adopters Check | DMH
              </span>
            </h2>

            <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
              <a
                href="https://t.me/diary_mh"
                target="__blank"
                className="block py-2 px-4 text-white font-medium bg-indigo-600 duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-lg hover:shadow-none"
              >
                Join Tele Group
              </a>
              <a
                href="https://raw.githubusercontent.com/FlipsiderEfer/Ethereum-Early-Adopters/main/Assets/Total.json"
                target="__blank"
                className="block py-2 px-4 text-white hover:text-gray-200 font-medium duration-150 active:bg-gray-300 border rounded-lg"
              >
                Source Repository
              </a>
            </div>
          </div>
          <div className="mt-14">
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                <label htmlFor="comment" className="sr-only"></label>
                <textarea
                  id="comment"
                  rows={6}
                  className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="EoA Address separated by new line"
                  required=""
                  defaultValue={addressList}
                  onChange={ChangeAddressList}
                />
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                <button
                  onClick={doCheck}
                  type="submit"
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
                >
                  Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="mt-12 relative h-max overflow-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="text-white font-medium border-b">
              <tr>
                <th className="py-3 pr-6">Address</th>
                <th className="py-3 pr-6">Status</th>
                <th className="py-3 pr-6">Contract Interaction Count</th>
              </tr>
            </thead>
            <tbody className="text-white divide-y">
              {tableItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item.address}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-2 rounded-full font-semibold text-xs ${
                        item.status == "Eligible"
                          ? "text-green-600 bg-green-50"
                          : "text-red-600 bg-blue-50"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
