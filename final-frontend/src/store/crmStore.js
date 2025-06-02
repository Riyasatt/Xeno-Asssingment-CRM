import { create } from 'zustand'

const useCrmStore = create((set) => ({
      backendUrl : "https://xeno-asssingment-crm.onrender.com",
      allCustomers : [],
      setAllCustomers:(customers) => {
            set({
                  allCustomers:customers
            })
      },
      allOrders : [],
      setAllOrders:(orders) => {
            set({
                  allOrders:orders
            })
      },
      allCampaigns : [],
      setAllCampaigns:(campaigns) => {
            set({
                  allCampaigns:campaigns
            })
      },

}))

export default useCrmStore;