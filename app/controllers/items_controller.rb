class ItemsController < ApplicationController
  before_action :set_item, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:show, :index, :show_expired]
  # GET /items
  # GET /items.json
  def index
    if params[:user_id]
      @items = Item.where(user_id: params[:user_id])
      @user = User.find(params[:user_id])
    else
      @items = Item.all
    end
  end

  # GET /items/1
  # GET /items/1.json
  def show
  end

  def show_expired
  end

  # GET /items/new
  def new
    @item = Item.new
    @user = User.find(params[:user_id]) if params[:user_id]
  end

  # GET /items/1/edit
  def edit
  end

  # POST /items
  # POST /items.json
  def create
      @item = Item.new(item_params)
      respond_to do |format|
        if @item.save
          format.html { redirect_to @item, notice: 'Item was successfully created.' }
          format.json { render :show, status: :created, location: @item }
        else
          # if @item.user_id
            # format.html{ redirect_to new_user_item_path(@item.user_id) }
          #   render "/users/4/items/new"
          # else
            format.html { render :new }
          # end
          format.json { render json: @item.errors, status: :unprocessable_entity }
        end
      end
  end

  # PATCH/PUT /items/1
  # PATCH/PUT /items/1.json
  def update
    respond_to do |format|
      if @item.update(item_params)
        format.html { redirect_to @item, notice: 'Item was successfully updated.' }
        format.json { render :show, status: :ok, location: @item }
      else
        format.html { render :edit }
        format.json { render json: @item.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /items/1
  # DELETE /items/1.json
  def destroy
    @item.destroy
    respond_to do |format|
      format.html { redirect_to items_url, notice: 'Item was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def destroy_collection
    Item.where(id: params[:expired_item_ids]).destroy_all
    respond_to do |format|
      format.html { redirect_to items_url, notice: 'Items were successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = Item.find(params[:id])
    end


    # Never trust parameters from the scary internet, only allow the white list through.
    def item_params
      params.require(:item).permit(:name, :expiration_date, :user_id, :fridge_id, fridge_attributes: [:name])
      # params.require(:items)
    end

    # def order_params
    #   params.require(:item).permit(:name, :expiration_date, :id)
    # end
end
