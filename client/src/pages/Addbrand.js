import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createBrand,
  getABrand,
  getBrands,
  resetState,
  updateABrand,
} from "../features/brand/brandSlice";
import { getMyDetails } from "../features/auth/authSlice";
import Brandlist from "./Brandlist";

let schema = yup.object().shape({
  title: yup.string().required("Brand Name is Required"),
});
const Addbrand = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getBrandId = location.pathname.split("/")[3];
  const newBrand = useSelector((state) => state.brand);
  const {
    isSuccess,
    isError,
    isLoading,
    createdBrand,
    brandName,
    updateABrand:updateBrand,
    createMessage,
  } = newBrand;
  useEffect(() => {
     dispatch(getMyDetails());
     dispatch(getBrands())
    if (getBrandId !== undefined) {
     
      dispatch(getABrand(getBrandId));
    } else {
      // dispatch(resetState());
    }
  }, [dispatch,getBrandId]);

  useEffect(() => {
    if (isSuccess && createdBrand) {
      toast.success("Brand Added Successfullly!");
      //  dispatch(resetState())
    }
    if (isSuccess && updateBrand) {
      toast.success("Brand Updated Successfullly!");
       navigate("/admin/brand");
    }

    if (createMessage) {
      toast.error(createMessage);
      
    }
    // dispatch(getBrands());
  }, [isSuccess, createMessage, isLoading,dispatch,updateBrand]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: brandName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getBrandId !== undefined) {
        const data = { id: getBrandId, brandData: values };
        dispatch(updateABrand(data));
        // dispatch(resetState());
          formik.resetForm();
      } else {
        dispatch(createBrand(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          dispatch(getBrands())
        }, 300);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getBrandId !== undefined ? "Edit" : "Add"} Brand
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Enter Brand"
            id="brand"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getBrandId !== undefined ? "Edit" : "Add"} Brand
          </button>
        </form>
      </div>
      <Brandlist/>
    </div>
  );
};

export default Addbrand;
