class FridgeCommentsController < ApplicationController
  # POST /fridge_comments
  # POST /fridge_comments.json
  def create
    @fridge_comment = FridgeComment.new(fridge_comment_params)
    
    respond_to do |format|
      if @fridge_comment.save
        format.json { render json: @fridge_comment, status: 201}
      else
        format.json { render json: @fridge_comment.errors, status: :unprocessable_entity }
      end
    end
  end
  # # PATCH/PUT /fridges/1
  # # PATCH/PUT /fridges/1.json
  # def update
  #   respond_to do |format|
  #     if @fridge.update(fridge_params)
  #       format.html { redirect_to @fridge, notice: 'Fridge was successfully updated.' }
  #       format.json { render :show, status: :ok, location: @fridge }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @fridge.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # # DELETE /fridges/1
  # # DELETE /fridges/1.json
  # def destroy
  #   @fridge.destroy
  #   respond_to do |format|
  #     format.html { redirect_to fridges_url, notice: 'Fridge was successfully destroyed.' }
  #     format.json { head :no_content }
  #   end
  # end
  private
    # # Use callbacks to share common setup or constraints between actions.
    # def set_fridge_comments
    #   @fridge_comments = FridgeComment.find(params[:id])
    # end

    # Never trust parameters from the scary internet, only allow the white list through.
    def fridge_comment_params
      params.require(:fridge_comment).permit(:comment, :fridge_id)
    end
end
