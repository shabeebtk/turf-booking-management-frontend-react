import axios from 'axios';
import React, { useState } from 'react';
import { BaseUrl } from '../../constant/BaseUrl';
import Cookies from 'js-cookie';
import { IoAlertCircleOutline } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';
import ButtonLoader from '../loader/ButtonLoader';


function ModalBookingRequests(props) {

    const [modalVisible, setModalVisible] = useState(false);
    const errorNotification = (message) => toast.error(message);
    const [btnLoader, setBtnLoader] = useState(false)

    const toggleModal = () => {
        if (!btnLoader) {
            setModalVisible(!modalVisible);
        }
    };

    const HandleAcceptBooking = () => {
        const ownerJwt = Cookies.get('ownerJwt')

        setBtnLoader(true)
        axios.post(`${BaseUrl}owner/bookings/accept`,
            {
                booking_id: props.booking_id,
                court: props.court,
                date: props.date,
                time: props.time,
                venue_id: props.venue_id
            }, {
            headers: {
                Authorization: `${ownerJwt}`
            }
        })
            .then((response) => {
                console.log(response.status == 208)
                if (response.status == 208) {
                    errorNotification('already accepted another request')
                }

                toggleModal()
                props.updateBookings()
            })
            .catch((response) => {
                console.log('working no')
                console.log(response)
                toggleModal()
                props.updateBookings()
                if (response.response.status == 408) {
                    errorNotification('request expired')
                }
            })
            .finally(()=>{
                setBtnLoader(false)
            })
    }

    const HandleDeclineBooking = () => {
        const ownerJwt = Cookies.get('ownerJwt')
        setBtnLoader(true)
        axios.post(`${BaseUrl}owner/bookings/decline`, { booking_id: props.booking_id }, {
            headers: {
                Authorization: `${ownerJwt}`
            }
        })
            .then((response) => {
                console.log(response)
                toggleModal()
                props.updateBookings()
            })
            .catch((response) => {
                console.log(response)
                toggleModal()
                props.updateBookings()
            })
            .finally(()=>{
                setBtnLoader(false)
            })
    }

    return (
        <div>
            {
                props.type == 'accept' ?

                    <p onClick={toggleModal} className={`${props.active ? 'text-red-600' : ''} font-medium  hover:underline`}>
                        accept
                    </p>
                    :
                    <p onClick={toggleModal} className={`${props.active ? 'text-red-600' : ''} font-medium  hover:underline`}>
                        decline
                    </p>
            }

            {modalVisible && (
                <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-screen bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-white rounded-lg shadow ">
                            <button
                                onClick={toggleModal}
                                type="button"
                                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <h1>hello</h1>
                            <div className="p-4 md:p-5 text-center">
                                <div className='flex justify-center'>
                                    <IoAlertCircleOutline color='black' size={60} />
                                </div>
                                <h3 className="mb-5 text-lg font-normal text-black">
                                    Are you sure?
                                </h3>


                                {
                                    props.type == 'accept' ?
                                        <div className='flex justify-center gap-3'>
                                            < button
                                                onClick={toggleModal}
                                                type="button"
                                                className={`text-gray-500 bg-red-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border text-white border-gray-200 text-sm font-medium px-5 py-2.5 `}
                                            >
                                                No, cancel
                                            </button>
                                            {
                                                !btnLoader ?
                                                    <button
                                                        onClick={HandleAcceptBooking}
                                                        type="button"
                                                        className="text-white bg-[#4caf50] hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                                                    >
                                                        Yes, accept
                                                    </button>
                                                    :
                                                    <button
                                                        type="button"
                                                        className="text-white bg-[#4caf50] overflow-hidden flex w-100 hover:bg-red-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm items-center text-center px-14"
                                                    >
                                                        <ButtonLoader />
                                                    </button>
                                            }


                                        </div>
                                        :
                                        <div className='flex justify-center gap-3'>
                                            < button
                                                onClick={toggleModal}
                                                type="button"
                                                className="text-gray-500 bg-red-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                            >
                                                No
                                            </button>
                                            <button
                                                onClick={HandleDeclineBooking}
                                                type="button"
                                                className="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                                            >
                                                Yes, cancel
                                            </button>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default ModalBookingRequests;
