<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDocumentRoutesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('document_routes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('trackingId', 512);
            $table->dateTime('timeSent')->nullable();
            $table->dateTime('timeSeen')->nullable();
            $table->dateTime('timeRecv')->nullable();
            $table->integer('srcOfficeId');
            $table->integer('dstOfficeId')->nullable();
            $table->integer('srcUserId')->nullable();
            $table->integer('dstUserId')->nullable();
            $table->integer('prevId')->nullable();
            $table->integer('nextId')->nullable();
            $table->text('annotations')->nullable();
            $table->boolean('final')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('document_routes');
    }
}