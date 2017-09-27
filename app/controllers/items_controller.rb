class ItemsController < ApplicationController
  before_action :set_item, only: [:show, :edit, :update, :destroy]

  # GET /items
  # GET /items.json
  def index
    if params[:user_id]
      @items = Item.where(user_id: params[:user_id])
    else
      @items = Item.all
    end
  end

  # GET /items/1
  # GET /items/1.json
  def show
  end

  # GET /items/new
  def new
    @item = Item.new
  end

  # GET /items/1/edit
  def edit
  end

  # POST /items
  # POST /items.json
  def create
      @item = Item.new(item_params)

      respond_to do |format|
        if valid_date_format(item_params[:expiration_date]) && @item.save
          format.html { redirect_to @item, notice: 'Item was successfully created.' }
          format.json { render :show, status: :created, location: @item }
        else
          #remember to make error msgs here #flash[:error]

          format.html { render :new }
          format.json { render json: @item.errors, status: :unprocessable_entity }
        end
      end
  end

  # PATCH/PUT /items/1
  # PATCH/PUT /items/1.json
  def update
    respond_to do |format|
      if valid_date_format(item_params[:expiration_date]) && @item.update(item_params)
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = Item.find(params[:id])
    end


    def valid_date_format(date)
      
      return nil if date.length != 6 #strptime can still work if it has extraneous digits
      #not sure if there is a better way
      Date.strptime(date,'%m%d%y') rescue nil
    end


    # Never trust parameters from the scary internet, only allow the white list through.
    def item_params
      params.require(:item).permit(:name, :expiration_date, :user_id, :fridge_id)
    end
end
