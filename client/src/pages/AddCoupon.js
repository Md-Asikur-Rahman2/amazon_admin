import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createCoupon,
  getACoupon,
  getAllCoupon,
  resetState,
  updateACoupon,
} from "../features/coupon/couponSlice";
import { getMyDetails } from "../features/auth/authSlice";
import Couponlist from "./Couponlist";

let schema = yup.object().shape({
  name: yup.string().required("Coupon Name is Required"),
  expiry: yup.date().required("Expiry Date is Required"),
  discount: yup.number().required("Discount Percentage is Required"),
});
const AddCoupon = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
 
  const getCouponId = location.pathname.split("/")[3];
  const newCoupon = useSelector((state) => state.coupon);
  const [isUpdateMode, setIsUpdateMode] = useState(getCouponId !== undefined);

  const {
    isSuccess,
    isError,
    isLoading,
    createdCoupon,
    couponName,
    couponDiscount,
    couponExpiry,
    updatedCoupon,
  } = newCoupon;
  const changeDateFormet = (date) => {
    const newDate = new Date(date).toLocaleDateString();
    const [month, day, year] = newDate.split("/");
    return [year, month, day].join("-");
  };
  useEffect(() => {
  dispatch(getAllCoupon());
},[dispatch])
 useEffect(() => {
   dispatch(getMyDetails());

   if (getCouponId !== undefined) {
     setIsUpdateMode(true); // Set to update mode
     dispatch(getACoupon(getCouponId));
     dispatch(getAllCoupon());
   } else {
     setIsUpdateMode(false); // Set to creation mode
    //  dispatch(resetState());
   }
 }, [dispatch, getCouponId]);


  useEffect(() => {
    if (isSuccess && createdCoupon) {
      toast.success("Coupon Added Successfullly!");
    }
    if (isSuccess && updatedCoupon) {
      toast.success("Coupon Updated Successfullly!");
      navigate("/admin/coupon");
    }
    if (isError && couponName && couponDiscount && couponExpiry) {
      toast.error("Copied Coupon Found");
    }
  }, [isSuccess, isError, isLoading]);
  const createCouponHandler = (e) => {
    dispatch(createCoupon(e));

   
    setTimeout(() => {
      dispatch(getAllCoupon());
    }, 100);
  };
  const updateCouponHandler = (e, resetForm) => {
     dispatch(updateACoupon(e));
     
     toast.success("Coupon updated successfully!");
     navigate("/admin/coupon");
  
    setTimeout(() => {
      dispatch(getAllCoupon());
     
       resetForm();
    }, 100);
  };
  const formik = useFormik({
    enableReinitialize: isUpdateMode,
    initialValues: {
      name: couponName || "",
      expiry: changeDateFormet(couponExpiry) || "",
      discount: couponDiscount || "",
    },
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      if (getCouponId !== undefined) {
        const data = { id: getCouponId, couponData: values };
       
        updateCouponHandler(data,resetForm);
      } else {
        // dispatch(createCoupon(values));
        formik.resetForm();
        createCouponHandler(values);

        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getCouponId !== undefined ? "Edit" : "Add"} Coupon
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="name"
            onChng={formik.handleChange("name")}
            onBlr={formik.handleBlur("name")}
            val={formik.values.name}
            label="Enter Coupon Name"
            id="name"
          />
          <div className="error">
            {formik.touched.name && formik.errors.name}
          </div>
          <CustomInput
            type="date"
            name="expiry"
            onChng={formik.handleChange("expiry")}
            onBlr={formik.handleBlur("expiry")}
            val={formik.values.expiry}
            label="Enter Expiry Data"
            id="date"
          />
          <div className="error">
            {formik.touched.expiry && formik.errors.expiry}
          </div>
          <CustomInput
            type="number"
            name="discount"
            onChng={formik.handleChange("discount")}
            onBlr={formik.handleBlur("discount")}
            val={formik.values.discount}
            label="Enter Discount"
            id="discount"
          />
          <div className="error">
            {formik.touched.discount && formik.errors.discount}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getCouponId !== undefined ? "Edit" : "Add"} Coupon
          </button>
        </form>
      </div>
      <Couponlist/>
    </div>
  );
};

export default AddCoupon;
