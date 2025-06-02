import { create } from 'zustand'

const useCrmStore = create((set) => ({
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