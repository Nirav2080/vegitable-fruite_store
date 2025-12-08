
'use server'

import { unstable_cache as cache } from 'next/cache';
import { getProducts as dbGetProducts, getProductById as dbGetProductById, getDashboardData as dbGetDashboardData } from '@/lib/actions/products';
import { getCategories as dbGetCategories, getCategoryById as dbGetCategoryById } from '@/lib/actions/categories';
import { getActiveBanners as dbGetActiveBanners, getBanners as dbGetBanners, getBannerById as dbGetBannerById } from '@/lib/actions/banners';
import { getOrders as dbGetOrders } from '@/lib/actions/orders';
import { getUsers as dbGetUsers, getUserById as dbGetUserById } from '@/lib/actions/users';
import { getAttributes as dbGetAttributes, getAttributeById as dbGetAttributeById } from '@/lib/actions/attributes';
import { getOffers as dbGetOffers, getOfferById as dbGetOfferById, getActiveOffers as dbGetActiveOffers } from '@/lib/actions/offers';


// == CACHING CONFIG ==
// Cache data for 60 seconds. This is a good balance for a dynamic e-commerce site.
const REVALIDATE_TIME = 60; 


// Products
export const getProducts = cache(async () => {
    return dbGetProducts();
}, ['products'], { revalidate: REVALIDATE_TIME });

export const getProductById = cache(async (id: string) => {
    return dbGetProductById(id);
}, ['product'], { revalidate: REVALIDATE_TIME });

// Dashboard
export const getDashboardData = cache(async () => {
    return dbGetDashboardData();
}, ['dashboard-data'], { revalidate: REVALIDATE_TIME });


// Categories
export const getCategories = cache(async (includeSubcategories = false) => {
    return dbGetCategories(includeSubcategories);
}, ['categories'], { revalidate: REVALIDATE_TIME, tags: ['categories'] });

export const getCategoryById = cache(async (id: string) => {
    return dbGetCategoryById(id);
}, ['category'], { revalidate: REVALIDATE_TIME });


// Banners
export const getBanners = cache(async () => {
    return dbGetBanners();
}, ['banners'], { revalidate: REVALIDATE_TIME });

export const getActiveBanners = cache(async () => {
    return dbGetActiveBanners();
}, ['active-banners'], { revalidate: REVALIDATE_TIME });

export const getBannerById = cache(async (id: string) => {
    return dbGetBannerById(id);
}, ['banner'], { revalidate: REVALIDATE_TIME });


// Orders
export const getOrders = cache(async () => {
    return dbGetOrders();
}, ['orders'], { revalidate: REVALIDATE_TIME });


// Users
export const getUsers = cache(async () => {
    return dbGetUsers();
}, ['users'], { revalidate: REVALIDATE_TIME });

export const getUserById = cache(async (id: string) => {
    return dbGetUserById(id);
}, ['user'], { revalidate: REVALIDATE_TIME });

// Attributes
export const getAttributes = cache(async () => {
    return dbGetAttributes();
}, ['attributes'], { revalidate: REVALIDATE_TIME });

export const getAttributeById = cache(async (id: string) => {
    return dbGetAttributeById(id);
}, ['attribute'], { revalidate: REVALIDATE_TIME });

// Offers
export const getOffers = cache(async () => {
    return dbGetOffers();
}, ['offers'], { revalidate: REVALIDATE_TIME });

export const getActiveOffers = cache(async () => {
    return dbGetActiveOffers();
}, ['active-offers'], { revalidate: REVALIDATE_TIME });

export const getOfferById = cache(async (id: string) => {
    return dbGetOfferById(id);
}, ['offer'], { revalidate: REVALIDATE_TIME });
